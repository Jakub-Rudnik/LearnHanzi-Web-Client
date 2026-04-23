import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ComponentProps, FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useUser } from "@/stores/user-store.ts";

export function LoginForm({ className, ...props }: ComponentProps<"form">) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useUser((state) => state.login);
  const error = useUser((state) => state.error);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const identifier = String(formData.get("identifier") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setIsSubmitting(true);

    try {
      await login({ identifier, password });
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
          <h1 className="text-2xl font-bold">{t("Login to your account")}</h1>
          <p className="text-sm text-balance text-muted-foreground">
            {t("Enter your email below to login to your account")}
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="identifier">{t("Email")}</FieldLabel>
          <Input
            id="identifier"
            name="identifier"
            type="email"
            placeholder={t("m@example.com")}
            required
            className="bg-background"
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">{t("Password")}</FieldLabel>
            <Link
              to="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              {t("Forgot your password?")}
            </Link>
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
            {isSubmitting ? "Logging in..." : t("Login")}
          </Button>
        </Field>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </FieldGroup>
    </form>
  );
}
