import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import type { ComponentProps } from "react";

export function LoginForm({ className, ...props }: ComponentProps<"form">) {
  const { t } = useTranslation();

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{t("Login to your account")}</h1>
          <p className="text-sm text-balance text-muted-foreground">
            {t("Enter your email below to login to your account")}
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">{t("Email")}</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder={t("m@example.com")}
            required
            className="bg-background"
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">{t("Password")}</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              {t("Forgot your password?")}
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            className="bg-background"
          />
        </Field>
        <Field>
          <Button type="submit">{t("Login")}</Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
