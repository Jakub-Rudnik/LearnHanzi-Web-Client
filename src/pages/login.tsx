import PageMeta from "@/components/seo/page-meta.tsx";
import { LoginForm } from "@/components/login-form.tsx";

export default function LoginPage() {
  return (
    <>
      <PageMeta
        title="Log in - LearnHanzi"
        description="Log in to continue your LearnHanzi practice and track your progress."
      />
      <LoginForm />
    </>
  );
}
