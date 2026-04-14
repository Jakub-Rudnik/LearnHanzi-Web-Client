import PageMeta from "@/components/seo/page-meta.tsx";
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
  const { t } = useTranslation();

  return (
    <>
      <PageMeta
        title={t("metaProfileTitle")}
        description={t("metaProfileDescription")}
      />
      <h1>{t("Profile")}</h1>
    </>
  );
}
