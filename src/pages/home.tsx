import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import PageMeta from "@/components/seo/page-meta.tsx";
import { TypographyH2, TypographyP } from "@/components/typography.tsx";
import { DataTable } from "@/components/user-results/data-table.tsx";
import { getHanziById, type Hanzi } from "@/lib/dictionary-api.ts";
import { listFavoriteHanzi } from "@/lib/flashcard-api.ts";
import { getUserHanziProgress } from "@/lib/progress-api.ts";
import { useUser } from "@/stores/user-store.ts";

type MeaningText = {
  en: string;
  pl: string;
};

type HomeResultEntry = {
  character: string;
  pronunciation: string;
  meaning: MeaningText;
  lastPractised: Date;
  level: number;
  status: boolean;
  favorite: boolean;
};

function mapHanziToHomeEntry(
  hanzi: Hanzi,
  options: {
    lastPractised: string;
    status: boolean;
    favorite: boolean;
  }
): HomeResultEntry {
  return {
    character: hanzi.character,
    pronunciation: hanzi.pinyin,
    meaning: {
      en: hanzi.meaning_en,
      pl: hanzi.meaning_pl,
    },
    lastPractised: new Date(options.lastPractised),
    level: hanzi.difficulty_level,
    status: options.status,
    favorite: options.favorite,
  };
}

export default function HomePage() {
  const { t } = useTranslation();
  const user = useUser((state) => state.user);
  const [entries, setEntries] = useState<HomeResultEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setEntries([]);
      setIsLoading(false);
      return;
    }

    let isActive = true;

    Promise.all([
      getUserHanziProgress(user.id),
      listFavoriteHanzi().catch(() => []),
    ])
      .then(async ([progressItems, favoriteItems]) => {
        const favoriteIds = new Set(favoriteItems.map((item) => item.hanzi.id));
        const hanziItems = await Promise.all(
          progressItems.map(async (item) => ({
            progress: item,
            hanzi: await getHanziById(item.hanzi_id),
          }))
        );

        if (isActive) {
          setEntries(
            hanziItems.map(({ progress, hanzi }) =>
              mapHanziToHomeEntry(hanzi, {
                lastPractised: progress.last_attempt_date,
                status: progress.last_is_correct,
                favorite: favoriteIds.has(hanzi.id),
              })
            )
          );
          setError(null);
        }
      })
      .catch((requestError) => {
        if (isActive) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : t("homePage.loadError")
          );
          setEntries([]);
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
  }, [t, user]);

  const tableData = useMemo(() => entries, [entries]);

  return (
    <>
      <PageMeta
        title={t("metaHomeTitle")}
        description={t("metaHomeDescription")}
      />

      <div className="flex w-full flex-col items-start justify-center">
        <TypographyH2>
          {t("homePage.WelcomeHeading")} {user?.username ?? "user"}!
        </TypographyH2>
        <TypographyP>{t("homePage.WelcomeHeadingDescription")}</TypographyP>
      </div>

      <div className="flex w-full py-8">
        {isLoading ? (
          <div className="flex min-h-48 w-full items-center justify-center text-sm text-muted-foreground">
            {t("homePage.loading")}
          </div>
        ) : error ? (
          <div className="w-full rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : tableData.length === 0 ? (
          <div className="w-full rounded-lg border p-4 text-sm text-muted-foreground">
            {t("homePage.emptyProgress")}
          </div>
        ) : (
          <DataTable data={tableData} />
        )}
      </div>
    </>
  );
}
