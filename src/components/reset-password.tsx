import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { confirmPasswordReset } from "@/lib/auth-api.ts";
import { useTranslation } from "react-i18next";
import type { ComponentProps, FormEvent } from "react";
import { useState } from "react";
import { Link, useSearchParams } from "react-router";

export function ResetPasswordForm({
  className,
  ...props
}: ComponentProps<"form">) {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialToken = searchParams.get("token") ?? "";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const token = String(formData.get("token") ?? "").trim();
    const newPassword = String(formData.get("new_password") ?? "");
    const confirmPassword = String(formData.get("confirm_password") ?? "");

    if (token.length < 20) {
      setError(t("resetPassword.validation.token"));
      return;
    }

    if (newPassword.length < 8) {
      setError(t("resetPassword.validation.password"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("resetPassword.validation.confirm"));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await confirmPasswordReset({ token, new_password: newPassword });
      form.reset();
      setIsComplete(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : t("resetPassword.error")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return (
      <div className={cn("flex flex-col gap-6 text-center", className)}>
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-2xl font-bold">{t("Reset password")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("resetPassword.success")}
          </p>
        </div>
        <Button asChild>
          <Link to="/login">{t("Login")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{t("Reset password")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("Enter new password")}
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="token">{t("resetPassword.token")}</FieldLabel>
          <Input
            id="token"
            name="token"
            type="text"
            required
            minLength={20}
            defaultValue={initialToken}
            className="bg-background"
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">{t("Password")}</FieldLabel>
          </div>
          <Input
            id="password"
            name="new_password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="bg-background"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">
            {t("resetPassword.confirmPassword")}
          </FieldLabel>
          <Input
            id="confirm-password"
            name="confirm_password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="bg-background"
          />
        </Field>
        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("resetPassword.submitting") : t("Reset password")}
          </Button>
        </Field>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </FieldGroup>
    </form>
  );
}
