import PageMeta from "@/components/seo/page-meta.tsx";
import { useTranslation } from "react-i18next";

export default function DictionaryPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageMeta
        title={t("metaDictionaryTitle")}
        description={t("metaDictionaryDescription")}
      />
      <h1>{t("Dictionary")}</h1>
    </>
  );
}
