import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import PageMeta from "@/components/seo/page-meta.tsx";
import { TypographyH2, TypographyP } from "@/components/typography.tsx";
import { DataTable } from "@/components/user-results/data-table.tsx";
import { type Hanzi, listHanzi } from "@/lib/dictionary-api.ts";
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
};

function mapHanziToHomeEntry(hanzi: Hanzi): HomeResultEntry {
  return {
    character: hanzi.character,
    pronunciation: hanzi.pinyin,
    meaning: {
      en: hanzi.meaning_en,
      pl: hanzi.meaning_pl,
    },
    lastPractised: new Date(),
    level: hanzi.difficulty_level,
  };
}

export default function HomePage() {
  const { t } = useTranslation();
  const user = useUser((state) => state.user);
  const [hanzi, setHanzi] = useState<Hanzi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    listHanzi({ limit: 100, offset: 0 })
      .then((data) => {
        if (isActive) {
          setHanzi(data);
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
          setHanzi([]);
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
  }, [t]);

  const tableData = useMemo(() => {
    return hanzi.map((item) => mapHanziToHomeEntry(item));
  }, [hanzi]);

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
            {t("homePage.emptySeed")}
          </div>
        ) : (
          <DataTable data={tableData} />
        )}
      </div>
    </>
  );
}
