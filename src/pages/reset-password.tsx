import { ResetPasswordForm } from "@/components/reset-password.tsx";
import PageMeta from "@/components/seo/page-meta.tsx";
import { useTranslation } from "react-i18next";

export default function ResetPasswordPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageMeta
        title={t("metaResetPasswordTitle")}
        description={t("metaResetPasswordDescription")}
      />
      <ResetPasswordForm />
    </>
  );
}
