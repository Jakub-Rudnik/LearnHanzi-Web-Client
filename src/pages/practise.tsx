import { useTranslation } from "react-i18next";
import PageMeta from "@/components/seo/page-meta.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Navigate, useParams } from "react-router";
import { getCharacter } from "@/lib/mock-data.ts";
import { Badge } from "@/components/ui/badge.tsx";
import AnimationCard from "@/components/practice/animation-card.tsx";
import StrokeOrderPracticeCard from "@/components/practice/stroke-order-practice-card.tsx";
import MemoryDrawCard from "@/components/practice/memory-draw.tsx";

export default function LearnCharPage() {
  const { t, i18n } = useTranslation();
  const accuracy = 56;
  const { char } = useParams();

  const hanziCharacter = char ? getCharacter(char) : -1;

  if (!char) {
    return <Navigate to="/home" replace />;
  }

  if (hanziCharacter == -1) {
    return <Navigate to="/home" replace />;
  }

  return (
    <>
      <PageMeta
        title={t("metaProfileTitle")}
        description={t("metaProfileDescription")}
      />

      <div className="flex w-full flex-col bg-background">
        <div
          className="grid w-full grid-cols-1 items-center gap-6 pb-12 lg:grid-cols-[220px_1fr_auto] lg:px-24 lg:py-12"
          style={{
            background:
              "radial-gradient(ellipse at bottom, oklch(0.85 0.08 150.069 / 25.23%) 0%, var(--background) 70%)",
          }}
        >
          <div className="flex flex-col items-center lg:w-min lg:items-start">
            <p className="text-[128px]">{char}</p>
            <p className="mt-2 w-full text-center text-2xl">
              [ {hanziCharacter.pronunciation} ]
            </p>
          </div>

          <p className="text-center font-medium md:text-left md:text-xl">
            {i18n.language == "en"
              ? hanziCharacter.meaning.en
              : hanziCharacter.meaning.pl}
          </p>

          <div className="flex items-center justify-center gap-2 lg:justify-end">
            <Badge variant="outline" className="rounded-full px-4">
              <span className="mr-2 inline-block size-2 rounded-full bg-amber-400" />
              {t("practicePage.accuracy", { accuracy })}
            </Badge>
            <Button
              variant="outline"
              size="icon"
              aria-label={t("practicePage.aria.practiceOptions")}
            >
              ≣
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label={t("practicePage.aria.favorite")}
            >
              ★
            </Button>
          </div>
        </div>

        <Separator className="pt-0" />

        <div className="grid gap-6 px-6 py-12 lg:grid-cols-3">
          <AnimationCard key={char} char={char} />

          <StrokeOrderPracticeCard key={char} char={char} />

          <MemoryDrawCard char={hanziCharacter.character} />
        </div>
      </div>
    </>
  );
}
