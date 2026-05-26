import { NavLink } from "react-router";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import Logo from "@/components/logo.tsx";
import PageMeta from "@/components/seo/page-meta.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useUser } from "@/stores/user-store.ts";
import { useTranslation } from "react-i18next";

const heroCharacters = ["学", "写", "读", "行", "语", "心", "明", "书"];

export default function LandingPage() {
  const { t } = useTranslation();
  const user = useUser((state) => state.user);

  const primaryHref = user ? "/home" : "/signup";
  const primaryLabel = user ? t("Go to app") : t("landingPage.hero.primary");

  return (
    <>
      <PageMeta
        title={t("metaLandingTitle")}
        description={t("metaLandingDescription")}
      />

      <main className="min-h-screen overflow-hidden bg-[oklch(0.985_0.012_150)] text-[oklch(0.145_0.008_326)] dark:bg-[oklch(0.145_0.008_326)] dark:text-[oklch(0.985_0_0)]">
        <section className="relative isolate flex min-h-[88svh] flex-col px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_20%,oklch(0.91_0.10_152)_0,transparent_30%),radial-gradient(circle_at_78%_16%,oklch(0.84_0.08_92)_0,transparent_28%),linear-gradient(135deg,oklch(0.99_0.006_150),oklch(0.94_0.026_164))] dark:bg-[radial-gradient(circle_at_18%_18%,oklch(0.42_0.11_152/0.42)_0,transparent_32%),radial-gradient(circle_at_80%_18%,oklch(0.44_0.08_92/0.34)_0,transparent_30%),linear-gradient(135deg,oklch(0.15_0.014_326),oklch(0.20_0.032_154))]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,oklch(0.35_0.02_150/0.08)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.35_0.02_150/0.08)_1px,transparent_1px)] bg-[size:64px_64px] dark:bg-[linear-gradient(to_right,oklch(0.98_0_0/0.08)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.98_0_0/0.08)_1px,transparent_1px)]" />

          <header className="mx-auto flex w-full max-w-7xl items-center justify-between py-5">
            <Logo to="/" />
            <nav className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <NavLink to="/login">{t("Log in")}</NavLink>
              </Button>
              <Button asChild size="sm">
                <NavLink to={primaryHref}>{primaryLabel}</NavLink>
              </Button>
            </nav>
          </header>

          <div className="mx-auto grid w-full max-w-7xl flex-1 content-center gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
            <div className="max-w-4xl space-y-8">
              <Badge
                variant="secondary"
                className="h-auto rounded-lg bg-background/80 px-3 py-1.5 text-foreground dark:bg-background/70"
              >
                {t("landingPage.hero.badge")}
              </Badge>

              <div className="space-y-5">
                <h1 className="max-w-5xl text-5xl font-semibold leading-[0.96] tracking-normal text-balance sm:text-6xl lg:text-7xl">
                  {t("landingPage.hero.title")}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[oklch(0.46_0.025_326)] sm:text-lg dark:text-[oklch(0.83_0.012_155)]">
                  {t("landingPage.hero.subtitle")}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <NavLink to={primaryHref}>
                    {primaryLabel}
                    <HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
                  </NavLink>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full border-foreground/15 bg-background/60 text-foreground backdrop-blur sm:w-auto dark:bg-background/40"
                >
                  <NavLink to="/dictionary">
                    {t("landingPage.hero.secondary")}
                  </NavLink>
                </Button>
              </div>

              <dl className="grid max-w-2xl grid-cols-3 gap-4 pt-4">
                <Metric value="4" label={t("landingPage.metrics.modules")} />
                <Metric value="100+" label={t("landingPage.metrics.characters")} />
                <Metric value="24/7" label={t("landingPage.metrics.practice")} />
              </dl>
            </div>

            <div className="relative hidden min-h-[520px] lg:block" aria-hidden="true">
              {heroCharacters.map((character, index) => (
                <span
                  key={character}
                  className="absolute flex size-24 items-center justify-center rounded-xl border border-foreground/10 bg-background/70 text-5xl font-semibold text-foreground shadow-sm backdrop-blur-md dark:bg-background/70"
                  style={{
                    left: `${(index % 3) * 132 + (index === 4 ? 56 : 0)}px`,
                    top: `${Math.floor(index / 3) * 136 + (index % 2) * 22}px`,
                    transform: `rotate(${[-7, 4, -2, 6, -5, 3, -4, 5][index]}deg)`,
                  }}
                >
                  {character}
                </span>
              ))}

              <div className="absolute right-0 bottom-6 w-[340px] rounded-xl border border-foreground/10 bg-card/85 p-4 text-card-foreground shadow-xl backdrop-blur dark:bg-card/90">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {t("landingPage.preview.title")}
                  </span>
                  <Badge variant="secondary">{t("landingPage.preview.badge")}</Badge>
                </div>
                <div className="space-y-3">
                  <PreviewRow character="行" progress="92%" />
                  <PreviewRow character="在" progress="81%" />
                  <PreviewRow character="不" progress="68%" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
            <Feature
              title={t("landingPage.features.practice.title")}
              description={t("landingPage.features.practice.description")}
            />
            <Feature
              title={t("landingPage.features.flashcards.title")}
              description={t("landingPage.features.flashcards.description")}
            />
            <Feature
              title={t("landingPage.features.progress.title")}
              description={t("landingPage.features.progress.description")}
            />
          </div>
        </section>
      </main>
    </>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-l border-foreground/15 pl-4">
      <dt className="text-2xl font-semibold">{value}</dt>
      <dd className="mt-1 text-sm leading-5 text-[oklch(0.46_0.025_326)] dark:text-[oklch(0.83_0.012_155)]">
        {label}
      </dd>
    </div>
  );
}

function PreviewRow({
  character,
  progress,
}: {
  character: string;
  progress: string;
}) {
  return (
    <div className="grid grid-cols-[36px_1fr_auto] items-center gap-3">
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-xl font-semibold text-primary">
        {character}
      </span>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: progress }} />
      </div>
      <span className="text-xs font-medium text-muted-foreground">{progress}</span>
    </div>
  );
}

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-xl border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </article>
  );
}
