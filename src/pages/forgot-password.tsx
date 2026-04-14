import { ForgotPasswordForm } from "@/components/forgot-password-form.tsx";
import PageMeta from "@/components/seo/page-meta.tsx";
import { useTranslation } from "react-i18next";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageMeta
        title={t("metaForgotPasswordTitle")}
        description={t("metaForgotPasswordDescription")}
      />
      <ForgotPasswordForm />
    </>
  );
}
