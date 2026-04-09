import { Helmet } from "react-helmet-async";
import { ResetPasswordForm } from "@/components/reset-password.tsx";

export default function ResetPasswordPage() {
  return (
    <>
      <Helmet>
        <title>Learn Hanzi - Reset Password</title>
      </Helmet>
      <ResetPasswordForm />
    </>
  );
}
