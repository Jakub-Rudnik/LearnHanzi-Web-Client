import PageMeta from "@/components/seo/page-meta.tsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { isUserActive } from "@/lib/auth-types.ts";
import { useUser } from "@/stores/user-store.ts";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";

function formatDate(value: string | null, locale: string, neverLabel: string) {
  if (!value) {
    return neverLabel;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getInitials(username: string) {
  const normalized = username.trim();

  if (!normalized) {
    return "U";
  }

  const initials = normalized
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return initials || normalized.slice(0, 2).toUpperCase() || "U";
}

function roleLabelKey(role: "USER" | "ADMIN") {
  return role === "ADMIN"
    ? "profilePage.values.administrator"
    : "profilePage.values.user";
}

function roleVariant(role: "USER" | "ADMIN") {
  return role === "ADMIN" ? "default" : "outline";
}

function statusLabelKey(accountStatus: string) {
  if (accountStatus === "ACTIVE") {
    return "profilePage.values.active";
  }

  if (accountStatus === "SUSPENDED") {
    return "profilePage.values.suspended";
  }

  return "profilePage.values.inactive";
}

function statusVariant(accountStatus: string) {
  return accountStatus === "ACTIVE" ? "secondary" : "destructive";
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex w-full flex-col gap-1 py-2 sm:py-3">
      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <span className="text-sm font-medium wrap-break-word text-foreground">
        {value}
      </span>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="w-full space-y-8 px-0 py-2 sm:py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="size-16 animate-pulse rounded-full bg-muted" />
          <div className="space-y-3">
            <div className="h-7 w-44 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-60 animate-pulse rounded-md bg-muted" />
            <div className="flex gap-2">
              <div className="h-5 w-24 animate-pulse rounded-full bg-muted" />
              <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        </div>
        <div className="h-9 w-28 animate-pulse rounded-lg bg-muted" />
      </div>

      <Separator />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="h-16 animate-pulse rounded-2xl bg-muted/70" />
        <div className="h-16 animate-pulse rounded-2xl bg-muted/70" />
        <div className="h-16 animate-pulse rounded-2xl bg-muted/70" />
        <div className="h-16 animate-pulse rounded-2xl bg-muted/70" />
        <div className="h-16 animate-pulse rounded-2xl bg-muted/70" />
        <div className="h-16 animate-pulse rounded-2xl bg-muted/70" />
      </div>
    </div>
  );
}

function EmptyState() {
  const { t } = useTranslation();

  return (
    <div className="w-full px-0 py-2 sm:py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight">
            {t("profilePage.emptyTitle")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("profilePage.emptyDescription")}
          </p>
        </div>
        <p className="max-w-2xl text-sm text-muted-foreground">
          {t("profilePage.emptyHint")}
        </p>
        <Button asChild className="w-full sm:w-auto">
          <NavLink to="/login">{t("profilePage.goToLogin")}</NavLink>
        </Button>
      </div>
    </div>
  );
}

function ProfileEditForm() {
  const { t } = useTranslation();
  const user = useUser((state) => state.user);
  const updateProfile = useUser((state) => state.updateProfile);
  const [username, setUsername] = useState(user?.username ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUsername(user?.username ?? "");
    setEmail(user?.email ?? "");
  }, [user?.email, user?.username]);

  const payload = useMemo(() => {
    const next: { username?: string; email?: string } = {};
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (user && trimmedUsername !== user.username) {
      next.username = trimmedUsername;
    }

    if (user && trimmedEmail !== user.email) {
      next.email = trimmedEmail;
    }

    return next;
  }, [email, user, username]);

  const hasChanges = Object.keys(payload).length > 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user || !hasChanges) {
      return;
    }

    if (payload.username !== undefined && payload.username.length < 3) {
      setError(t("profilePage.edit.validation.username"));
      return;
    }

    if (payload.email !== undefined && !payload.email.includes("@")) {
      setError(t("profilePage.edit.validation.email"));
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      await updateProfile(payload);
      setMessage(t("profilePage.edit.success"));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : t("profilePage.edit.error")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">
          {t("profilePage.edit.title")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("profilePage.edit.description")}
        </p>
      </div>
      <FieldGroup className="gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="profile-username">
              {t("profilePage.labels.username")}
            </FieldLabel>
            <Input
              id="profile-username"
              value={username}
              minLength={3}
              maxLength={50}
              onChange={(event) => setUsername(event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="profile-email">
              {t("profilePage.labels.email")}
            </FieldLabel>
            <Input
              id="profile-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Field>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button type="submit" disabled={!hasChanges || isSubmitting}>
            {isSubmitting
              ? t("profilePage.edit.saving")
              : t("profilePage.edit.save")}
          </Button>
          {message ? (
            <p className="text-sm text-muted-foreground">{message}</p>
          ) : null}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
      </FieldGroup>
    </form>
  );
}

function PasswordChangeForm() {
  const { t } = useTranslation();
  const changePassword = useUser((state) => state.changePassword);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const currentPassword = String(formData.get("current_password") ?? "");
    const newPassword = String(formData.get("new_password") ?? "");
    const confirmPassword = String(formData.get("confirm_password") ?? "");

    if (newPassword.length < 8) {
      setError(t("profilePage.password.validation.password"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("profilePage.password.validation.confirm"));
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      form.reset();
      setMessage(t("profilePage.password.success"));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : t("profilePage.password.error")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">
          {t("profilePage.password.title")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("profilePage.password.description")}
        </p>
      </div>
      <FieldGroup className="gap-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="current-password">
              {t("profilePage.password.current")}
            </FieldLabel>
            <Input
              id="current-password"
              name="current_password"
              type="password"
              minLength={8}
              required
              autoComplete="current-password"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="new-password">
              {t("profilePage.password.next")}
            </FieldLabel>
            <Input
              id="new-password"
              name="new_password"
              type="password"
              minLength={8}
              required
              autoComplete="new-password"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="confirm-new-password">
              {t("profilePage.password.confirm")}
            </FieldLabel>
            <Input
              id="confirm-new-password"
              name="confirm_password"
              type="password"
              minLength={8}
              required
              autoComplete="new-password"
            />
          </Field>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? t("profilePage.password.saving")
              : t("profilePage.password.save")}
          </Button>
          {message ? (
            <p className="text-sm text-muted-foreground">{message}</p>
          ) : null}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
      </FieldGroup>
    </form>
  );
}

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const user = useUser((state) => state.user);
  const isLoading = useUser((state) => state.isLoading);
  const locale = i18n.language || "en-GB";

  return (
    <>
      <PageMeta
        title={t("metaProfileTitle")}
        description={t("metaProfileDescription")}
      />

      <div className="flex w-full flex-col gap-10 px-0 py-8 sm:py-12">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">
            {t("Profile")}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            {t("profilePage.description")}
          </p>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : user ? (
          <div className="w-full space-y-8 px-0 py-2 sm:py-4">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <Avatar size="lg" className="size-16 shrink-0">
                  <AvatarFallback className="text-base font-semibold">
                    {getInitials(user.username)}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-2xl font-semibold tracking-tight">
                      {user.username}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant={roleVariant(user.role)}>
                      {t(roleLabelKey(user.role))}
                    </Badge>
                    <Badge variant={statusVariant(user.account_status)}>
                      {t(statusLabelKey(user.account_status))}
                    </Badge>
                  </div>
                </div>
              </div>

              <Button asChild variant="ghost" size="sm" className="w-fit">
                <NavLink to="/home">{t("profilePage.goToDashboard")}</NavLink>
              </Button>
            </div>

            <Separator />

            {isUserActive(user) ? (
              <>
                <ProfileEditForm />
                <Separator />
                <PasswordChangeForm />
                <Separator />
              </>
            ) : null}

            <div className="flex flex-col gap-4">
              <DetailRow
                label={t("profilePage.labels.username")}
                value={user.username}
              />
              <DetailRow
                label={t("profilePage.labels.email")}
                value={user.email}
              />
              <DetailRow
                label={t("profilePage.labels.role")}
                value={t(roleLabelKey(user.role))}
              />
              <DetailRow
                label={t("profilePage.labels.status")}
                value={t(statusLabelKey(user.account_status))}
              />
              <DetailRow
                label={t("profilePage.labels.memberSince")}
                value={formatDate(
                  user.created_at,
                  locale,
                  t("profilePage.values.never")
                )}
              />
              <DetailRow
                label={t("profilePage.labels.lastLogin")}
                value={formatDate(
                  user.last_login_at,
                  locale,
                  t("profilePage.values.never")
                )}
              />
              <DetailRow
                label={t("profilePage.labels.updatedAt")}
                value={formatDate(
                  user.updated_at,
                  locale,
                  t("profilePage.values.never")
                )}
              />
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </>
  );
}
