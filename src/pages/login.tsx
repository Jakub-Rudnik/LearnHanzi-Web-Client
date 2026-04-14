import PageMeta from "@/components/seo/page-meta.tsx";
import { LoginForm } from "@/components/login-form.tsx";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageMeta
        title={t("metaLoginTitle")}
        description={t("metaLoginDescription")}
      />
      <LoginForm />
    </>
  );
}
