import { ForgotPasswordForm } from "@/components/forgot-password-form.tsx";
import { Helmet } from "react-helmet-async";

export default function ForgotPasswordPage() {
  return (
    <>
      <Helmet>
        <title>Learn Hanzi - Forgot Password</title>
      </Helmet>
      <ForgotPasswordForm />
    </>
  );
}
