import PageMeta from "@/components/seo/page-meta.tsx";
import { SignupForm } from "@/components/signup-form.tsx";
import { useTranslation } from "react-i18next";

export default function SignupPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageMeta
        title={t("metaSignupTitle")}
        description={t("metaSignupDescription")}
      />
      <SignupForm />
    </>
  );
}
