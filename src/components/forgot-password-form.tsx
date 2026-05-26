import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { requestPasswordReset } from "@/lib/auth-api.ts";
import { useTranslation } from "react-i18next";
import type { ComponentProps, FormEvent } from "react";
import { useState } from "react";
import { Link } from "react-router";

export function ForgotPasswordForm({
  className,
  ...props
}: ComponentProps<"form">) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();

    setIsSubmitting(true);
    setError(null);
    setMessage(null);
    setResetToken(null);

    try {
      const response = await requestPasswordReset({ email });
      setMessage(response.detail || t("forgotPassword.success"));
      setResetToken(response.reset_token);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : t("forgotPassword.error")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{t("Forgot password")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("Enter email to get email with reset password link")}
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">{t("Email")}</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={t("m@example.com")}
            required
            className="bg-background"
          />
        </Field>
        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("forgotPassword.sending") : t("Send link")}
          </Button>
        </Field>
        {message ? (
          <p className="text-sm text-muted-foreground">{message}</p>
        ) : null}
        {resetToken ? (
          <p className="text-sm text-muted-foreground">
            {t("forgotPassword.devResetLink")}{" "}
            <Link
              className="font-medium text-primary underline-offset-4 hover:underline"
              to={`/reset-password?token=${encodeURIComponent(resetToken)}`}
            >
              {t("forgotPassword.openReset")}
            </Link>
          </p>
        ) : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </FieldGroup>
    </form>
  );
}
