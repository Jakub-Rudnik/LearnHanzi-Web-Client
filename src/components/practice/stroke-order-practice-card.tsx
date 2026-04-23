import { useCallback, useEffect, useRef, useState } from "react";
import HanziWriter from "hanzi-writer";
import { useTranslation } from "react-i18next";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";

type StrokeOrderPracticeCardProps = {
  char: string;
};

export default function StrokeOrderPracticeCard({
  char,
}: StrokeOrderPracticeCardProps) {
  const { t } = useTranslation();
  const practiceContainerRef = useRef<HTMLDivElement | null>(null);
  const writerRef = useRef<ReturnType<typeof HanziWriter.create> | null>(null);
  const isOutlineVisibleRef = useRef(true);
  const [isQuizLoading, setIsQuizLoading] = useState(true);
  const [hasQuizError, setHasQuizError] = useState(false);
  const [isOutlineVisible, setIsOutlineVisible] = useState(true);

  const syncOutlineState = useCallback(
	async (writer: ReturnType<typeof HanziWriter.create>) => {
	  if (isOutlineVisibleRef.current) {
		await writer.showOutline({ duration: 0 });
	  } else {
		await writer.hideOutline({ duration: 0 });
	  }
	},
	[],
  );

  const startQuiz = async ({ reloadCharacter = false }: { reloadCharacter?: boolean } = {}) => {
	const writer = writerRef.current;

	if (!writer) {
	  return;
	}

	setIsQuizLoading(true);
	setHasQuizError(false);

	try {
	  if (reloadCharacter) {
		await writer.setCharacter(char);
	  }

	  await syncOutlineState(writer);
	  await writer.quiz();
	} catch {
	  setHasQuizError(true);
	} finally {
	  setIsQuizLoading(false);
	}
  };

  useEffect(() => {
	const container = practiceContainerRef.current;

	if (!container) {
	  return;
	}

	let isActive = true;
	const existingWriter = writerRef.current;
	const writer =
	  existingWriter ??
	  (writerRef.current = HanziWriter.create(container, char, {
		padding: 5,
		showCharacter: false,
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

	const initQuiz = async () => {
	  setIsQuizLoading(true);
	  setHasQuizError(false);

	  try {
		if (existingWriter) {
		  await existingWriter.setCharacter(char);
		}

		await syncOutlineState(writer);
		await writer.quiz();
	  } catch {
		if (isActive) {
		  setHasQuizError(true);
		}
	  } finally {
		if (isActive) {
		  setIsQuizLoading(false);
		}
	  }
	};

	void initQuiz();

	return () => {
	  isActive = false;
	  resizeObserver?.disconnect();
	  writer.cancelQuiz();
	};
  }, [char, syncOutlineState]);

  const handleErase = () => {
	if (isQuizLoading) {
	  return;
	}

	const writer = writerRef.current;

	if (!writer) {
	  return;
	}

	void startQuiz({ reloadCharacter: hasQuizError });
  };

  const handleTemplateToggle = () => {
	if (isQuizLoading) {
	  return;
	}

	const writer = writerRef.current;

	if (!writer) {
	  return;
	}

	const nextOutlineVisible = !isOutlineVisible;
	isOutlineVisibleRef.current = nextOutlineVisible;
	setIsOutlineVisible(nextOutlineVisible);

	if (nextOutlineVisible) {
	  void writer.showOutline({ duration: 0 });
	} else {
	  void writer.hideOutline({ duration: 0 });
	}
  };

  return (
	<Card className="border-none">
	  <CardHeader>
		<CardTitle className="text-2xl font-semibold">
		  {t("practice.strokeOrder.title")}
		</CardTitle>
	  </CardHeader>
	  <CardContent>
		<div
		  ref={practiceContainerRef}
		  id="character-target-div"
		  className="relative h-130 w-full overflow-hidden rounded-xl border bg-muted/20"
		>
		  {isQuizLoading ? (
			<div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
			  {t("practice.strokeOrder.loading")}
			</div>
		  ) : null}
		  {hasQuizError ? (
			<div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
			  {t("practice.strokeOrder.unavailable")}
			</div>
		  ) : null}
		</div>
	  </CardContent>
	  <CardFooter className="justify-between gap-3">
		<Button variant="outline" onClick={handleErase}>
		  {t("practice.actions.erase")}
		</Button>
		<Button
		  variant="outline"
		  onClick={handleTemplateToggle}
		  aria-pressed={isOutlineVisible}
		>
		  {t("practice.strokeOrder.template")}
		</Button>
	  </CardFooter>
	</Card>
  );
}


