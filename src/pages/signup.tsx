import PageMeta from "@/components/seo/page-meta.tsx";
import { SignupForm } from "@/components/signup-form.tsx";

export default function SignupPage() {
  return (
    <>
      <PageMeta
        title="Sign up - LearnHanzi"
        description="Create your LearnHanzi account and start learning Chinese characters."
      />
      <SignupForm />
    </>
  );
}
