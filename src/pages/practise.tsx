import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PageMeta from "@/components/seo/page-meta.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Navigate, NavLink, useParams } from "react-router";
import { Badge } from "@/components/ui/badge.tsx";
import AnimationCard from "@/components/practice/animation-card.tsx";
import StrokeOrderPracticeCard from "@/components/practice/stroke-order-practice-card.tsx";
import MemoryDrawCard from "@/components/practice/memory-draw.tsx";
import { ApiError } from "@/lib/api-client.ts";
import { getHanziByCharacter, type Hanzi } from "@/lib/dictionary-api.ts";
import { getLastProgress, type ProgressResponse } from "@/lib/progress-api.ts";
import { useUser } from "@/stores/user-store.ts";

function getMeaning(hanzi: Hanzi, language: string) {
  return language.toLowerCase().startsWith("pl")
    ? hanzi.meaning_pl
    : hanzi.meaning_en;
}

function formatAccuracy(value: number) {
  return Math.round(value * 100);
}

export default function LearnCharPage() {
  const { t, i18n } = useTranslation();
  const { char } = useParams();
  const user = useUser((state) => state.user);
  const [hanzi, setHanzi] = useState<Hanzi | null>(null);
  const [lastProgress, setLastProgress] = useState<ProgressResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!char) {
      return;
    }

    let isActive = true;

    getHanziByCharacter(char)
      .then(async (data) => {
        if (!isActive) {
          return;
        }

        setHanzi(data);
        setNotFound(false);
        setError(null);
        setLastProgress(null);

        if (user) {
          const progress = await getLastProgress({
            userId: user.id,
            hanziId: data.id,
          });

          if (isActive) {
            setLastProgress(progress);
          }
        }
      })
      .catch((requestError) => {
        if (!isActive) {
          return;
        }

        if (requestError instanceof ApiError && requestError.status === 404) {
          setNotFound(true);
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : t("practicePage.loadError")
        );
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [char, t, user]);

  if (!char) {
    return <Navigate to="/home" replace />;
  }

  if (notFound) {
    return <Navigate to="/dictionary" replace />;
  }

  const accuracy =
    lastProgress !== null
      ? t("practicePage.accuracy", {
          accuracy: formatAccuracy(lastProgress.accuracy_score),
        })
      : t("practicePage.notPracticedYet");

  return (
    <>
      <PageMeta
        title={t("metaProfileTitle")}
        description={t("metaProfileDescription")}
      />

      {isLoading ? (
        <div className="flex min-h-[40vh] w-full items-center justify-center text-sm text-muted-foreground">
          {t("practicePage.loading")}
        </div>
      ) : error ? (
        <div className="w-full rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : hanzi ? (
        <div className="flex w-full flex-col bg-background">
          <div
            className="grid w-full grid-cols-1 items-center gap-6 pb-12 lg:grid-cols-[220px_1fr_auto] lg:px-24 lg:py-12"
            style={{
              background:
                "radial-gradient(ellipse at bottom, oklch(0.85 0.08 150.069 / 25.23%) 0%, var(--background) 70%)",
            }}
          >
            <div className="flex flex-col items-center lg:w-min lg:items-start">
              <p className="text-[128px]">{hanzi.character}</p>
              <p className="mt-2 w-full text-center text-2xl">
                [ {hanzi.pinyin} ]
              </p>
            </div>

            <div className="flex flex-col gap-4 text-center md:text-left lg:w-2/3">
              <p className="font-medium md:text-xl">
                {getMeaning(hanzi, i18n.language)}
              </p>
              <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                <Badge variant="secondary">
                  {t("dictionaryPage.level", {
                    level: hanzi.difficulty_level,
                  })}
                </Badge>
                {hanzi.theme_category ? (
                  <Badge variant="outline">{hanzi.theme_category}</Badge>
                ) : null}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 lg:justify-end">
              <Badge variant="outline" className="rounded-full px-4">
                <span className="mr-2 inline-block size-2 rounded-full bg-amber-400" />
                {accuracy}
              </Badge>
              <Button asChild variant="outline" size="sm">
                <NavLink to="/dictionary">{t("Dictionary")}</NavLink>
              </Button>
            </div>
          </div>

          <Separator className="pt-0" />

          <div className="grid gap-6 px-6 py-12 lg:grid-cols-3">
            <AnimationCard key={hanzi.character} char={hanzi.character} />

            <StrokeOrderPracticeCard
              key={hanzi.character}
              char={hanzi.character}
            />

            <MemoryDrawCard
              char={hanzi.character}
              hanziId={hanzi.id}
              userId={user?.id ?? null}
              onProgressRecorded={setLastProgress}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
