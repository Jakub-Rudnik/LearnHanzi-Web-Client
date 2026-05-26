import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ComponentProps, FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useUser } from "@/stores/user-store.ts";

export function SignupForm({ className, ...props }: ComponentProps<"form">) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const signup = useUser((state) => state.signup);
  const error = useUser((state) => state.error);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setIsSubmitting(true);

    try {
      await signup({ username, email, password });
      navigate("/home", { replace: true });
    } catch {
      // The store already captures the auth error message.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{t("Signup to LearnHanzi")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("Enter email, name and password to create account")}
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">{t("Name")}</FieldLabel>
          <Input
            id="name"
            name="username"
            type="text"
            placeholder={t("Example name")}
            required
            className="bg-background"
          />
        </Field>
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
          <div className="flex items-center">
            <FieldLabel htmlFor="password">{t("Password")}</FieldLabel>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            required
            className="bg-background"
          />
        </Field>
        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("authLinks.signingUp") : t("Signup")}
          </Button>
        </Field>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <p className="text-center text-sm text-muted-foreground">
          {t("authLinks.hasAccount")}{" "}
          <Link
            to="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {t("authLinks.goToLogin")}
          </Link>
        </p>
      </FieldGroup>
    </form>
  );
}
