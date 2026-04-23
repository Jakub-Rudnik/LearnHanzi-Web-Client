import { useTranslation } from "react-i18next";
import PageMeta from "@/components/seo/page-meta.tsx";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Separator } from "@/components/ui/separator.tsx";

export default function LearnCharPage() {
  const { t } = useTranslation();

  const character = "写";
  const pinyin = "xiě";
  const meaning = "write, draw";
  const accuracy = 56;

  return (
    <>
      <PageMeta
        title={t("metaProfileTitle")}
        description={t("metaProfileDescription")}
      />

      <section className="flex w-full flex-col gap-8">
        <div className="flex w-full items-center justify-end">
          <div className="relative w-full max-w-sm">
            <Input
              placeholder={t("Search word")}
              className="pr-10 text-base"
              aria-label={t("Search word")}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground">
              ⌕
            </span>
          </div>
        </div>

        <Card className="border-none bg-transparent py-0 shadow-none ring-0">
          <CardContent className="px-0">
            <div className="grid w-full grid-cols-1 items-center gap-6 md:grid-cols-[220px_1fr_auto]">
              <div className="flex flex-col items-center md:items-start">
                <p className="text-[128px] leading-none">{character}</p>
                <p className="mt-2 text-3xl leading-none">[ {pinyin} ]</p>
              </div>

              <p className="text-center text-4xl font-medium md:text-left">
                {meaning}
              </p>

              <div className="flex items-center justify-center gap-2 md:justify-end">
                <Button variant="outline" className="rounded-full px-4">
                  <span className="mr-2 inline-block size-2 rounded-full bg-amber-400" />
                  {accuracy}% {t("correct")}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={t("Practice options")}
                >
                  ≣
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={t("Favorite")}
                >
                  ★
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full rounded-3xl">
          <CardContent className="grid gap-6 p-6 lg:grid-cols-3">
            <Card className="overflow-hidden rounded-2xl">
              <CardHeader>
                <CardTitle className="text-4xl font-semibold">
                  {t("Animation")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-[520px] rounded-xl border bg-muted/30">
                  <div className="absolute inset-0 opacity-25">
                    <div className="absolute top-1/2 left-0 h-px w-full bg-border" />
                    <div className="absolute top-0 left-1/2 h-full w-px bg-border" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,transparent_49.5%,hsl(var(--border))_50%,transparent_50.5%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_top_right,transparent_49.5%,hsl(var(--border))_50%,transparent_50.5%)]" />
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center text-[220px] text-foreground/70">
                    {character}
                  </div>

                  <button
                    type="button"
                    className="absolute inset-x-0 bottom-8 mx-auto flex size-24 items-center justify-center rounded-full border-4 border-foreground bg-background text-4xl"
                    aria-label={t("Play animation")}
                  >
                    ▶
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden rounded-2xl">
              <CardHeader>
                <CardTitle className="text-4xl font-semibold">
                  {t("Stroke order practice")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[520px] rounded-xl border bg-muted/20">
                  <div className="flex h-full items-center justify-center text-[220px] text-foreground/20">
                    {character}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between gap-3">
                <Button variant="outline">{t("Erase")}</Button>
                <Button variant="outline">{t("Template")}</Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden rounded-2xl">
              <CardHeader>
                <CardTitle className="text-4xl font-semibold">
                  {t("Draw from memory")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[520px] rounded-xl border bg-[radial-gradient(circle,_hsl(var(--border))_1.5px,_transparent_1.5px)] [background-size:32px_32px]" />
              </CardContent>
              <CardFooter className="justify-between gap-3">
                <Button variant="outline">{t("Erase")}</Button>
                <Separator
                  orientation="vertical"
                  className="hidden h-6 lg:block"
                />
                <Button variant="outline">{t("Check")}</Button>
              </CardFooter>
            </Card>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
