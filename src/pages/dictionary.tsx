import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";

import PageMeta from "@/components/seo/page-meta.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table.tsx";
import { type Hanzi, listHanzi } from "@/lib/dictionary-api.ts";
import { ArrowLeft02Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const PAGE_SIZE = 100;

function getMeaning(hanzi: Hanzi, language: string) {
  return language.toLowerCase().startsWith("pl")
    ? hanzi.meaning_pl
    : hanzi.meaning_en;
}

function matchesDifficulty(hanzi: Hanzi, filter: string) {
  if (filter === "all") {
    return true;
  }

  if (filter === "4plus") {
    return hanzi.difficulty_level >= 4;
  }

  return hanzi.difficulty_level === Number(filter);
}

export default function DictionaryPage() {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState<Hanzi[]>([]);
  const [offset, setOffset] = useState(0);
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    listHanzi({ limit: PAGE_SIZE, offset })
      .then((data) => {
        if (isActive) {
          setItems(data);
          setError(null);
        }
      })
      .catch((requestError) => {
        if (isActive) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : t("dictionaryPage.errors.load")
          );
          setItems([]);
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
  }, [offset, t]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((hanzi) => {
      if (!matchesDifficulty(hanzi, difficulty)) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return [hanzi.character, hanzi.pinyin, hanzi.meaning_en, hanzi.meaning_pl]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [difficulty, items, query]);

  const canGoBack = offset > 0;
  const canGoForward = items.length === PAGE_SIZE;
  const page = Math.floor(offset / PAGE_SIZE) + 1;
  const previousPage = Math.max(1, page - 1);
  const nextPage = page + 1;
  const difficultyOptions = [
    { value: "all", label: t("dictionaryPage.filters.all") },
    { value: "1", label: t("dictionaryPage.filters.1") },
    { value: "2", label: t("dictionaryPage.filters.2") },
    { value: "3", label: t("dictionaryPage.filters.3") },
    { value: "4plus", label: t("dictionaryPage.filters.4plus") },
  ];

  return (
    <>
      <PageMeta
        title={t("metaDictionaryTitle")}
        description={t("metaDictionaryDescription")}
      />

      <div className="flex w-full flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">
            {t("Dictionary")}
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            {t("dictionaryPage.description")}
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("dictionaryPage.searchPlaceholder")}
            className="md:max-w-md"
          />

          <div className="flex flex-wrap gap-2">
            {difficultyOptions.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={difficulty === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setDifficulty(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">
            {t("dictionaryPage.loading")}
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border p-4 text-sm text-muted-foreground">
            {t("dictionaryPage.emptySeed")}
          </div>
        ) : (
          <>
            <div className="w-full overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("dictionaryPage.table.character")}</TableHead>
                    <TableHead>{t("dictionaryPage.table.pinyin")}</TableHead>
                    <TableHead>{t("dictionaryPage.table.meaning")}</TableHead>
                    <TableHead>
                      {t("dictionaryPage.table.difficulty")}
                    </TableHead>
                    <TableHead className="text-right">
                      {t("dictionaryPage.table.actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((hanzi) => (
                      <TableRow key={hanzi.id}>
                        <TableCell className="text-3xl font-semibold">
                          {hanzi.character}
                        </TableCell>
                        <TableCell className="font-medium">
                          {hanzi.pinyin}
                        </TableCell>
                        <TableCell className="max-w-xl whitespace-normal">
                          {getMeaning(hanzi, i18n.language)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {t("dictionaryPage.level", {
                              level: hanzi.difficulty_level,
                            })}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild size="sm" variant="outline">
                            <NavLink to={`/learn/${hanzi.character}`}>
                              {t("dictionaryPage.practice")}
                            </NavLink>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        {t("dictionaryPage.noResults")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-center gap-2 rounded-xl px-4 pt-2 pb-6">
              <Button
                variant="outline"
                size="icon-sm"
                className="shrink-0"
                disabled={!canGoBack}
                onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
                aria-label={t("dictionaryPage.previousPageAria", {
                  page: previousPage,
                })}
              >
                <HugeiconsIcon icon={ArrowLeft02Icon} className="size-4" />
              </Button>

              <Badge
                variant="secondary"
                className="min-w-10 justify-center rounded-full px-3 py-1 text-sm font-medium"
              >
                {page}
              </Badge>

              <Button
                variant="outline"
                size="icon-sm"
                className="shrink-0"
                disabled={!canGoForward}
                onClick={() => setOffset(offset + PAGE_SIZE)}
                aria-label={t("dictionaryPage.nextPageAria", {
                  page: nextPage,
                })}
              >
                <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
