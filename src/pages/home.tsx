import PageMeta from "@/components/seo/page-meta.tsx";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <>
      <PageMeta
        title={t("metaHomeTitle")}
        description={t("metaHomeDescription")}
      />
      <h1>{t("Welcome")}</h1>
    </>
  );
}
