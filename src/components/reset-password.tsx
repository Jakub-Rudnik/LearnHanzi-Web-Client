import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import type { ComponentProps } from "react";

export function ResetPasswordForm({
  className,
  ...props
}: ComponentProps<"form">) {
  const { t } = useTranslation();

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{t("Reset password")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("Enter new password")}
          </p>
        </div>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">{t("Password")}</FieldLabel>
          </div>
          <Input
            id="password"
            type="password"
            required
            className="bg-background"
          />
        </Field>
        <Field>
          <Button type="submit">{t("Reset password")}</Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
