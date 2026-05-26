import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";

import PageMeta from "@/components/seo/page-meta.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { listHanzi, type Hanzi } from "@/lib/dictionary-api.ts";
import {
  addDifficultHanzi,
  addFavoriteHanzi,
  addCardToFlashcardSet,
  createFlashcardSet,
  deleteFlashcardSet,
  getFlashcardSet,
  getStudySet,
  listDifficultHanzi,
  listFavoriteHanzi,
  listFlashcardSets,
  removeDifficultHanzi,
  removeFavoriteHanzi,
  removeCardFromFlashcardSet,
  updateFlashcardSet,
  type FlashcardSet,
  type FlashcardSetSummary,
  type FlashcardSetUpdate,
  type MarkedHanzi,
  type StudyCard,
  type StudySet,
} from "@/lib/flashcard-api.ts";
import { useUser } from "@/stores/user-store.ts";

const DICTIONARY_LIMIT = 100;

type ActiveView = "sets" | "favorites" | "difficult";
type EditingSet = FlashcardSet | null;

function getMeaning(
  hanzi: Pick<Hanzi, "meaning_pl" | "meaning_en">,
  language: string
) {
  return language.toLowerCase().startsWith("pl")
    ? hanzi.meaning_pl
    : hanzi.meaning_en;
}

function formatDate(value: string, locale: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date);
}

function sameIds(left: string[], right: string[]) {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((id, index) => id === right[index]);
}

function uniqueIds(ids: string[]) {
  return Array.from(new Set(ids));
}

function HanziPicker({
  dictionary,
  selectedIds,
  onToggle,
  query,
  onQueryChange,
  pendingHanziId,
}: {
  dictionary: Hanzi[];
  selectedIds: string[];
  onToggle: (hanziId: string) => void;
  query: string;
  onQueryChange: (query: string) => void;
  pendingHanziId?: string | null;
}) {
  const { t, i18n } = useTranslation();
  const selected = new Set(selectedIds);
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = dictionary.filter((hanzi) => {
    if (!normalizedQuery) {
      return true;
    }

    return [
      hanzi.character,
      hanzi.pinyin,
      hanzi.meaning_en,
      hanzi.meaning_pl,
      hanzi.theme_category ?? "",
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);
  });

  return (
    <div className="flex flex-col gap-3">
      <Input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={t("flashcardsPage.form.search")}
      />
      <div className="max-h-80 overflow-y-auto rounded-lg border">
        {filtered.length > 0 ? (
          filtered.map((hanzi) => (
            <label
              key={hanzi.id}
              className="flex cursor-pointer items-start gap-3 border-b px-3 py-2 last:border-b-0 hover:bg-muted/60"
            >
              <input
                type="checkbox"
                className="mt-2"
                checked={selected.has(hanzi.id)}
                disabled={pendingHanziId === hanzi.id}
                onChange={() => onToggle(hanzi.id)}
              />
              <span className="text-2xl font-semibold">{hanzi.character}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{hanzi.pinyin}</span>
                <span className="block text-sm text-muted-foreground">
                  {getMeaning(hanzi, i18n.language)}
                </span>
              </span>
              <Badge variant="secondary">
                {t("flashcardsPage.level", {
                  level: hanzi.difficulty_level,
                })}
              </Badge>
            </label>
          ))
        ) : (
          <div className="p-4 text-sm text-muted-foreground">
            {t("flashcardsPage.form.noHanzi")}
          </div>
        )}
      </div>
    </div>
  );
}

function SetForm({
  editingSet,
  dictionary,
  onCancel,
  onSaved,
  onSetUpdated,
}: {
  editingSet: EditingSet;
  dictionary: Hanzi[];
  onCancel: () => void;
  onSaved: () => void;
  onSetUpdated: (set: FlashcardSet) => void;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState(editingSet?.name ?? "");
  const [description, setDescription] = useState(editingSet?.description ?? "");
  const [selectedIds, setSelectedIds] = useState<string[]>(
    editingSet?.cards
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((card) => card.hanzi_id) ?? []
  );
  const [query, setQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingHanziId, setPendingHanziId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const originalIds = useMemo(
    () =>
      editingSet?.cards
        .slice()
        .sort((a, b) => a.position - b.position)
        .map((card) => card.hanzi_id) ?? [],
    [editingSet]
  );

  const syncSelectedIds = (set: FlashcardSet) => {
    setSelectedIds(
      set.cards
        .slice()
        .sort((a, b) => a.position - b.position)
        .map((card) => card.hanzi_id)
    );
  };

  const toggleHanzi = async (hanziId: string) => {
    const isSelected = selectedIds.includes(hanziId);

    if (!editingSet) {
      setSelectedIds((current) =>
        isSelected
          ? current.filter((id) => id !== hanziId)
          : [...current, hanziId]
      );
      return;
    }

    setPendingHanziId(hanziId);
    setError(null);

    try {
      const updatedSet = isSelected
        ? await removeCardFromFlashcardSet(editingSet.id, hanziId)
        : await addCardToFlashcardSet(editingSet.id, hanziId);

      syncSelectedIds(updatedSet);
      onSetUpdated(updatedSet);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : t("flashcardsPage.errors.card")
      );
    } finally {
      setPendingHanziId(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const nextIds = uniqueIds(selectedIds);

    if (!trimmedName) {
      setError(t("flashcardsPage.form.validation.name"));
      return;
    }

    if (nextIds.length === 0) {
      setError(t("flashcardsPage.form.validation.hanzi"));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (editingSet) {
        const payload: FlashcardSetUpdate = {};

        if (trimmedName !== editingSet.name) {
          payload.name = trimmedName;
        }

        if ((trimmedDescription || null) !== editingSet.description) {
          payload.description = trimmedDescription || null;
        }

        if (!sameIds(nextIds, originalIds)) {
          payload.hanzi_ids = nextIds;
        }

        if (Object.keys(payload).length > 0) {
          await updateFlashcardSet(editingSet.id, payload);
        }
      } else {
        await createFlashcardSet(
          {
            name: trimmedName,
            description: trimmedDescription || null,
            hanzi_ids: nextIds,
          },
        );
      }

      onSaved();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : t("flashcardsPage.errors.save")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editingSet
            ? t("flashcardsPage.form.editTitle")
            : t("flashcardsPage.form.createTitle")}
        </CardTitle>
        <CardDescription>{t("flashcardsPage.form.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="flashcard-name">
                  {t("flashcardsPage.form.name")}
                </FieldLabel>
                <Input
                  id="flashcard-name"
                  value={name}
                  maxLength={150}
                  onChange={(event) => setName(event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="flashcard-description">
                  {t("flashcardsPage.form.descriptionLabel")}
                </FieldLabel>
                <Input
                  id="flashcard-description"
                  value={description}
                  maxLength={500}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </Field>
            </div>
            <Field>
              <FieldLabel>{t("flashcardsPage.form.hanzi")}</FieldLabel>
              <HanziPicker
                dictionary={dictionary}
                selectedIds={selectedIds}
                onToggle={(hanziId) => void toggleHanzi(hanziId)}
                query={query}
                onQueryChange={setQuery}
                pendingHanziId={pendingHanziId}
              />
            </Field>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? t("flashcardsPage.form.saving")
                  : t("flashcardsPage.form.save")}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                {t("flashcardsPage.cancel")}
              </Button>
            <span className="text-sm text-muted-foreground">
                {t("flashcardsPage.form.selected", {
                  count: selectedIds.length,
                })}
              </span>
              {editingSet ? (
                <span className="text-sm text-muted-foreground">
                  {t("flashcardsPage.form.instantCards")}
                </span>
              ) : null}
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

function StudyPanel({
  studySet,
  onClose,
  onCardUpdated,
}: {
  studySet: StudySet;
  onClose: () => void;
  onCardUpdated: (card: StudyCard) => void;
}) {
  const { t, i18n } = useTranslation();
  const [index, setIndex] = useState(0);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const [pendingFlag, setPendingFlag] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const card = studySet.cards[index];

  useEffect(() => {
    setIndex(0);
    setIsAnswerVisible(false);
  }, [studySet.set_id]);

  if (!card) {
    return null;
  }

  const updateCardFlag = async (flag: "favorite" | "difficult") => {
    setPendingFlag(flag);
    setError(null);

    try {
      if (flag === "favorite") {
        if (card.is_favorite) {
          await removeFavoriteHanzi(card.hanzi.id);
        } else {
          await addFavoriteHanzi(card.hanzi.id);
        }

        onCardUpdated({ ...card, is_favorite: !card.is_favorite });
      } else {
        if (card.is_difficult) {
          await removeDifficultHanzi(card.hanzi.id);
        } else {
          await addDifficultHanzi(card.hanzi.id);
        }

        onCardUpdated({ ...card, is_difficult: !card.is_difficult });
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : t("flashcardsPage.errors.flag")
      );
    } finally {
      setPendingFlag(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{studySet.set_name}</CardTitle>
        <CardDescription>
          {t("flashcardsPage.study.progress", {
            current: index + 1,
            total: studySet.cards.length,
          })}
        </CardDescription>
        <CardAction>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            {t("flashcardsPage.study.close")}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex min-h-80 flex-col items-center justify-center gap-5 rounded-lg border bg-muted/20 p-6 text-center">
          <div className="text-8xl font-semibold leading-none">
            {card.hanzi.character}
          </div>
          {isAnswerVisible ? (
            <div className="space-y-2">
              <p className="text-xl font-medium">{card.hanzi.pinyin}</p>
              <p className="max-w-xl text-sm text-muted-foreground">
                {getMeaning(card.hanzi, i18n.language)}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary">
                  {t("flashcardsPage.level", {
                    level: card.hanzi.difficulty_level,
                  })}
                </Badge>
                {card.hanzi.theme_category ? (
                  <Badge variant="outline">{card.hanzi.theme_category}</Badge>
                ) : null}
              </div>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAnswerVisible(true)}
            >
              {t("flashcardsPage.study.showAnswer")}
            </Button>
          )}
        </div>
        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={card.is_favorite ? "default" : "outline"}
              disabled={pendingFlag === "favorite"}
              onClick={() => void updateCardFlag("favorite")}
            >
              {t("flashcardsPage.study.favorite")}
            </Button>
            <Button
              type="button"
              variant={card.is_difficult ? "default" : "outline"}
              disabled={pendingFlag === "difficult"}
              onClick={() => void updateCardFlag("difficult")}
            >
              {t("flashcardsPage.study.difficult")}
            </Button>
            <Button asChild type="button" variant="outline">
              <NavLink to={`/learn/${card.hanzi.character}`}>
                {t("flashcardsPage.practice")}
              </NavLink>
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={index === 0}
              onClick={() => {
                setIndex((current) => Math.max(0, current - 1));
                setIsAnswerVisible(false);
              }}
            >
              {t("flashcardsPage.previous")}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={index >= studySet.cards.length - 1}
              onClick={() => {
                setIndex((current) =>
                  Math.min(studySet.cards.length - 1, current + 1)
                );
                setIsAnswerVisible(false);
              }}
            >
              {t("flashcardsPage.next")}
            </Button>
          </div>
        </div>
        {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
      </CardContent>
    </Card>
  );
}

function MarkedHanziList({
  items,
  onRemove,
}: {
  items: MarkedHanzi[];
  onRemove: (hanziId: string) => void;
}) {
  const { t, i18n } = useTranslation();

  if (items.length === 0) {
    return (
      <div className="rounded-lg border p-4 text-sm text-muted-foreground">
        {t("flashcardsPage.marked.empty")}
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map(({ hanzi }) => (
        <Card key={hanzi.id} size="sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="text-3xl">{hanzi.character}</span>
              <span>{hanzi.pinyin}</span>
            </CardTitle>
            <CardDescription>{getMeaning(hanzi, i18n.language)}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {t("flashcardsPage.level", {
                  level: hanzi.difficulty_level,
                })}
              </Badge>
              <Button asChild size="sm" variant="outline">
                <NavLink to={`/learn/${hanzi.character}`}>
                  {t("flashcardsPage.practice")}
                </NavLink>
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={() => onRemove(hanzi.id)}
              >
                {t("flashcardsPage.remove")}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function FlashCardsPage() {
  const { t, i18n } = useTranslation();
  const user = useUser((state) => state.user);
  const [activeView, setActiveView] = useState<ActiveView>("sets");
  const [sets, setSets] = useState<FlashcardSetSummary[]>([]);
  const [dictionary, setDictionary] = useState<Hanzi[]>([]);
  const [editingSet, setEditingSet] = useState<EditingSet>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [studySet, setStudySet] = useState<StudySet | null>(null);
  const [favorites, setFavorites] = useState<MarkedHanzi[]>([]);
  const [difficult, setDifficult] = useState<MarkedHanzi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDictionaryLoading, setIsDictionaryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const locale = i18n.language || "en-GB";

  const loadSets = async () => {
    const data = await listFlashcardSets();
    setSets(data);
  };

  const loadMarked = async (view: ActiveView) => {
    if (view === "favorites") {
      setFavorites(await listFavoriteHanzi());
    }

    if (view === "difficult") {
      setDifficult(await listDifficultHanzi());
    }
  };

  useEffect(() => {
    let isActive = true;

    Promise.resolve()
      .then(() => loadSets())
      .catch((requestError) => {
        if (isActive) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : t("flashcardsPage.errors.load")
          );
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [t, user?.id]);

  useEffect(() => {
    let isActive = true;

    listHanzi({ limit: DICTIONARY_LIMIT, offset: 0 })
      .then((items) => {
        if (isActive) {
          setDictionary(items);
        }
      })
      .catch(() => {
        if (isActive) {
          setDictionary([]);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsDictionaryLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (activeView === "sets") {
      return;
    }

    let isActive = true;

    Promise.resolve()
      .then(() => loadMarked(activeView))
      .catch((requestError) => {
        if (isActive) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : t("flashcardsPage.errors.load")
          );
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [activeView, t]);

  const openCreateForm = () => {
    setEditingSet(null);
    setStudySet(null);
    setIsFormOpen(true);
  };

  const openEditForm = async (setId: string) => {
    setError(null);

    try {
      const set = await getFlashcardSet(setId);
      setEditingSet(set);
      setStudySet(null);
      setIsFormOpen(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : t("flashcardsPage.errors.loadSet")
      );
    }
  };

  const handleDelete = async (setId: string) => {
    setError(null);

    try {
      await deleteFlashcardSet(setId);
      setSets((current) => current.filter((set) => set.id !== setId));

      if (studySet?.set_id === setId) {
        setStudySet(null);
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : t("flashcardsPage.errors.delete")
      );
    }
  };

  const handleStudy = async (setId: string) => {
    setError(null);
    setIsFormOpen(false);

    try {
      setStudySet(await getStudySet(setId));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : t("flashcardsPage.errors.study")
      );
    }
  };

  const handleSaved = async () => {
    setIsFormOpen(false);
    setEditingSet(null);
    setError(null);

    try {
      await loadSets();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : t("flashcardsPage.errors.load")
      );
    }
  };

  const updateStudyCard = (card: StudyCard) => {
    setStudySet((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        cards: current.cards.map((item) =>
          item.card_id === card.card_id ? card : item
        ),
      };
    });
  };

  const updateEditedSet = (set: FlashcardSet) => {
    setEditingSet(set);
    setSets((current) =>
      current.map((item) =>
        item.id === set.id
          ? {
              ...item,
              name: set.name,
              description: set.description,
              cards_count: set.cards_count,
              updated_at: set.updated_at,
            }
          : item
      )
    );
  };

  const removeMarked = async (hanziId: string) => {
    setError(null);

    try {
      if (activeView === "favorites") {
        await removeFavoriteHanzi(hanziId);
        setFavorites((current) =>
          current.filter((item) => item.hanzi.id !== hanziId)
        );
      }

      if (activeView === "difficult") {
        await removeDifficultHanzi(hanziId);
        setDifficult((current) =>
          current.filter((item) => item.hanzi.id !== hanziId)
        );
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : t("flashcardsPage.errors.flag")
      );
    }
  };

  return (
    <>
      <PageMeta
        title={t("metaFlashCardsTitle")}
        description={t("metaFlashCardsDescription")}
      />

      <div className="flex w-full flex-col gap-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight">
              {t("Flashcards")}
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              {t("flashcardsPage.description")}
            </p>
          </div>
          <Button type="button" onClick={openCreateForm}>
            {t("flashcardsPage.newSet")}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {(["sets", "favorites", "difficult"] as ActiveView[]).map((view) => (
            <Button
              key={view}
              type="button"
              variant={activeView === view ? "default" : "outline"}
              onClick={() => {
                setActiveView(view);
                setStudySet(null);
                setIsFormOpen(false);
              }}
            >
              {t(`flashcardsPage.views.${view}`)}
            </Button>
          ))}
        </div>

        {error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {isFormOpen ? (
          isDictionaryLoading ? (
            <div className="rounded-lg border p-4 text-sm text-muted-foreground">
              {t("flashcardsPage.form.loadingDictionary")}
            </div>
          ) : (
            <SetForm
              editingSet={editingSet}
              dictionary={dictionary}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingSet(null);
              }}
              onSaved={() => void handleSaved()}
              onSetUpdated={updateEditedSet}
            />
          )
        ) : null}

        {studySet ? (
          <StudyPanel
            studySet={studySet}
            onClose={() => setStudySet(null)}
            onCardUpdated={updateStudyCard}
          />
        ) : null}

        <Separator />

        {isLoading ? (
          <div className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">
            {t("flashcardsPage.loading")}
          </div>
        ) : activeView === "sets" ? (
          sets.length === 0 ? (
            <div className="rounded-lg border p-4 text-sm text-muted-foreground">
              {t("flashcardsPage.empty")}
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {sets.map((set) => (
                <Card key={set.id}>
                  <CardHeader>
                    <CardTitle>{set.name}</CardTitle>
                    <CardDescription>
                      {set.description || t("flashcardsPage.noDescription")}
                    </CardDescription>
                    <CardAction>
                      <Badge variant="secondary">
                        {t("flashcardsPage.cardsCount", {
                          count: set.cards_count,
                        })}
                      </Badge>
                    </CardAction>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      <p className="text-sm text-muted-foreground">
                        {t("flashcardsPage.updated", {
                          date: formatDate(set.updated_at, locale),
                        })}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => void handleStudy(set.id)}
                        >
                          {t("flashcardsPage.study.action")}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => void openEditForm(set.id)}
                        >
                          {t("flashcardsPage.edit")}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => void handleDelete(set.id)}
                        >
                          {t("flashcardsPage.delete")}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        ) : activeView === "favorites" ? (
          <MarkedHanziList items={favorites} onRemove={removeMarked} />
        ) : (
          <MarkedHanziList items={difficult} onRemove={removeMarked} />
        )}
      </div>
    </>
  );
}
