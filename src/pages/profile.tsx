import PageMeta from "@/components/seo/page-meta.tsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { useUser } from "@/stores/user-store.ts";
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

function roleLabel(role: "USER" | "ADMIN", t: (key: string) => string) {
  return role === "ADMIN"
    ? t("profilePage.values.administrator")
    : t("profilePage.values.user");
}

function roleVariant(role: "USER" | "ADMIN") {
  return role === "ADMIN" ? "default" : "outline";
}

function statusLabel(isActive: boolean, t: (key: string) => string) {
  return isActive ? t("profilePage.values.active") : t("profilePage.values.inactive");
}

function statusVariant(isActive: boolean) {
  return isActive ? "secondary" : "destructive";
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex w-full flex-col gap-1 py-2 sm:py-3">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-medium text-foreground wrap-break-word">
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

export default function ProfilePage() {
  const { t, i18n } = useTranslation();
  const user = useUser((state) => state.user);
  const isLoading = useUser((state) => state.isLoading);
  const locale = i18n.language || undefined;

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
                      {roleLabel(user.role, t)}
                    </Badge>
                    <Badge variant={statusVariant(user.is_active)}>
                      {statusLabel(user.is_active, t)}
                    </Badge>
                  </div>
                </div>
              </div>

              <Button asChild variant="ghost" size="sm" className="w-fit">
                <NavLink to="/home">{t("profilePage.goToDashboard")}</NavLink>
              </Button>
            </div>

            <Separator />

            <div className="flex flex-col gap-4">
              <DetailRow label={t("profilePage.labels.username")} value={user.username} />
              <DetailRow label={t("profilePage.labels.email")} value={user.email} />
              <DetailRow label={t("profilePage.labels.role")} value={roleLabel(user.role, t)} />
              <DetailRow label={t("profilePage.labels.status")} value={statusLabel(user.is_active, t)} />
              <DetailRow
                label={t("profilePage.labels.memberSince")}
                value={formatDate(user.created_at, locale, t("profilePage.values.never"))}
              />
              <DetailRow
                label={t("profilePage.labels.lastLogin")}
                value={formatDate(user.last_login_at, locale, t("profilePage.values.never"))}
              />
              <DetailRow
                label={t("profilePage.labels.updatedAt")}
                value={formatDate(user.updated_at, locale, t("profilePage.values.never"))}
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
