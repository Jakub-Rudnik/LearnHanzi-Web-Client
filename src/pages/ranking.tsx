import PageMeta from "@/components/seo/page-meta.tsx";
import { useTranslation } from "react-i18next";

export default function RankingPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageMeta
        title={t("metaRankingTitle")}
        description={t("metaRankingDescription")}
      />
      <h1>{t("Ranking")}</h1>
    </>
  );
}
