import PageMeta from "@/components/seo/page-meta.tsx";
import { useTranslation } from "react-i18next";

export default function FlashCardsPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageMeta
        title={t("metaFlashCardsTitle")}
        description={t("metaFlashCardsDescription")}
      />
      <h1>{t("Flashcards")}</h1>
    </>
  );
}
