import { useEffect, useRef, useState } from "react";
import HanziWriter from "hanzi-writer";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card.tsx";

type AnimationCardProps = {
  char: string;
};

export default function AnimationCard({ char }: AnimationCardProps) {
  const { t } = useTranslation();
  const animationContainerRef = useRef<HTMLDivElement | null>(null);
  const writerRef = useRef<ReturnType<typeof HanziWriter.create> | null>(null);
  const [isAnimationLoading, setIsAnimationLoading] = useState(true);
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false);

  useEffect(() => {
    const container = animationContainerRef.current;

    if (!container) {
      return;
    }

    let isActive = true;
    const existingWriter = writerRef.current;
    const writer =
      existingWriter ??
      (writerRef.current = HanziWriter.create(container, char, {
        padding: 20,
        showOutline: true,
      }));

    const syncDimensions = () => {
      const { width, height } = container.getBoundingClientRect();

      if (width > 0 && height > 0) {
        writer.updateDimensions({ width, height });
      }
    };

    syncDimensions();

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            syncDimensions();
          })
        : null;

    resizeObserver?.observe(container);

    const loadPromise = existingWriter
      ? existingWriter.setCharacter(char)
      : writer.getCharacterData();

    loadPromise
      .then(() => {
        if (!isActive) {
          return;
        }

        writer.loopCharacterAnimation();
        setIsAnimationPlaying(true);
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        setIsAnimationPlaying(false);
      })
      .finally(() => {
        if (isActive) {
          setIsAnimationLoading(false);
        }
      });

    return () => {
      isActive = false;
      resizeObserver?.disconnect();
      writer.pauseAnimation();
    };
  }, [char]);

  const handleAnimationToggle = () => {
    const writer = writerRef.current;

    if (!writer || isAnimationLoading) {
      return;
    }

    if (isAnimationPlaying) {
      writer.pauseAnimation();
      setIsAnimationPlaying(false);
    } else {
      writer.resumeAnimation();
      setIsAnimationPlaying(true);
    }
  };

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          {t("practice.animation.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={animationContainerRef}
          id="animation"
          role="button"
          tabIndex={0}
          aria-label={t("practice.animation.aria.canvas")}
          aria-pressed={isAnimationPlaying}
          onClick={handleAnimationToggle}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              handleAnimationToggle();
            }
          }}
          className="relative h-130 w-full overflow-hidden rounded-xl border bg-muted/20 transition-colors outline-none hover:bg-muted/30 focus-visible:ring-2 focus-visible:ring-ring"
        >
          {isAnimationLoading ? (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
              {t("practice.animation.loading")}
            </div>
          ) : null}
          <div className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-background/80 px-3 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur">
            {isAnimationPlaying
              ? t("practice.animation.pauseHint")
              : t("practice.animation.playHint")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
