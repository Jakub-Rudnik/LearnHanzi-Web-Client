import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge.tsx";
import { useTranslation } from "react-i18next";
import {
  recognizeHanzi,
  type RecognitionResponse,
} from "@/lib/recognition-api.ts";
import { recordProgress, type ProgressResponse } from "@/lib/progress-api.ts";

type CanvasApi = {
  clear: () => void;
  getImageBase64: () => string | null;
};

export default function MemoryDrawCard({
  char,
  hanziId,
  userId,
  onProgressRecorded,
}: {
  char: string;
  hanziId: string;
  userId: string | null;
  onProgressRecorded?: (progress: ProgressResponse) => void;
}) {
  const { t } = useTranslation();
  const tr = (key: string) => t(key as never) as string;
  const [canvasApi, setCanvasApi] = useState<CanvasApi | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [recognition, setRecognition] = useState<RecognitionResponse | null>(
    null
  );
  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressWarning, setProgressWarning] = useState<string | null>(null);

  const handleCanvasApiReady = useCallback((api: CanvasApi | null) => {
    setCanvasApi(api);
  }, []);

  const handleErase = () => {
    canvasApi?.clear();
    setRecognition(null);
    setProgress(null);
    setError(null);
    setProgressWarning(null);
  };

  const handleCheck = async () => {
    if (!canvasApi || isChecking) {
      return;
    }

    const imageBase64 = canvasApi.getImageBase64();

    if (!imageBase64) {
      setError(tr("practice.memoryDraw.canvasNotReady"));
      return;
    }

    setIsChecking(true);
    setError(null);
    setProgressWarning(null);
    setProgress(null);

    try {
      const payload = await recognizeHanzi({
        image_base64: imageBase64,
        character: char,
      });

      setRecognition(payload);

      if (userId) {
        try {
          const savedProgress = await recordProgress({
            user_id: userId,
            hanzi_id: hanziId,
            is_correct: payload.character === char,
            accuracy_score: payload.confidence,
            attempt_date: new Date().toISOString(),
          });

          setProgress(savedProgress);
          onProgressRecorded?.(savedProgress);
        } catch {
          setProgressWarning(tr("practice.memoryDraw.progressFailed"));
        }
      }
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : tr("practice.memoryDraw.connectionFailed");
      setError(message);
      setRecognition(null);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          {tr("practice.memoryDraw.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Canvas onApiReady={handleCanvasApiReady} />
      </CardContent>
      <CardFooter className="justify-between gap-3">
        <Button variant="outline" onClick={handleErase}>
          {tr("practice.actions.erase")}
        </Button>

        <Button variant="outline" onClick={handleCheck} disabled={isChecking}>
          {isChecking
            ? tr("practice.memoryDraw.checking")
            : tr("practice.memoryDraw.check")}
        </Button>
      </CardFooter>

      {error ? (
        <p className="px-6 pb-4 text-sm text-destructive">{error}</p>
      ) : null}

      {progressWarning ? (
        <p className="px-6 pb-4 text-sm text-amber-600 dark:text-amber-400">
          {progressWarning}
        </p>
      ) : null}

      {recognition ? (
        <div className="space-y-1 px-6 pb-4 text-sm">
          {recognition.character == char ? (
            <Badge>{tr("practice.memoryDraw.correct")}</Badge>
          ) : (
            <Badge variant="destructive">
              {tr("practice.memoryDraw.incorrect")}
            </Badge>
          )}
          <p>
            {tr("practice.memoryDraw.predicted")}:{" "}
            <span className="text-xl font-semibold">
              {recognition.character}
            </span>
          </p>
          <p>
            {tr("practice.memoryDraw.confidence")}:{" "}
            {(recognition.confidence * 100).toFixed(1)}%
          </p>
          {progress ? (
            <p className="font-medium text-primary">
              {t("practice.memoryDraw.pointsEarned", {
                points: progress.points_earned,
              })}
            </p>
          ) : null}
          {recognition.top_predictions &&
          recognition.top_predictions.length > 0 ? (
            <p>
              {tr("practice.memoryDraw.top")}:{" "}
              {recognition.top_predictions
                .slice(0, 3)
                .map(
                  (item) =>
                    `${item.character} (${(item.confidence * 100).toFixed(1)}%)`
                )
                .join(", ")}
            </p>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}

type CanvasProps = {
  onApiReady: (api: CanvasApi | null) => void;
};

function Canvas({ onApiReady }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const getCanvasPoint = (event: PointerEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;

    if (!canvas || !context) {
      return;
    }

    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();
  };

  const getImageBase64 = () => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return null;
    }

    const dataUrl = canvas.toDataURL("image/png");
    const base64 = dataUrl.split(",")[1];

    return base64 ?? null;
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    contextRef.current = context;

    const syncCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const pixelRatio = window.devicePixelRatio || 1;
      const width = Math.max(1, Math.floor(rect.width * pixelRatio));
      const height = Math.max(1, Math.floor(rect.height * pixelRatio));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineWidth = 20;
      context.strokeStyle = "black";

      clearCanvas();
    };

    syncCanvasSize();

    onApiReady({ clear: clearCanvas, getImageBase64 });

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      event.preventDefault();
      const point = getCanvasPoint(event, canvas);

      isDrawingRef.current = true;
      lastPointRef.current = point;
      canvas.setPointerCapture(event.pointerId);

      context.beginPath();
      context.arc(point.x, point.y, 5, 0, 2 * Math.PI);
      context.fillStyle = "black";
      context.fill();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!isDrawingRef.current) {
        return;
      }

      event.preventDefault();

      const point = getCanvasPoint(event, canvas);
      const lastPoint = lastPointRef.current;

      if (!lastPoint) {
        lastPointRef.current = point;
        return;
      }

      context.beginPath();
      context.moveTo(lastPoint.x, lastPoint.y);
      context.lineTo(point.x, point.y);
      context.stroke();

      lastPointRef.current = point;
    };

    const stopDrawing = (event: PointerEvent) => {
      isDrawingRef.current = false;
      lastPointRef.current = null;

      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      syncCanvasSize();
    });

    resizeObserver.observe(canvas);

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", stopDrawing);
    canvas.addEventListener("pointercancel", stopDrawing);
    canvas.addEventListener("pointerleave", stopDrawing);

    return () => {
      resizeObserver.disconnect();
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", stopDrawing);
      canvas.removeEventListener("pointercancel", stopDrawing);
      canvas.removeEventListener("pointerleave", stopDrawing);
      contextRef.current = null;
      onApiReady(null);
    };
  }, [onApiReady]);

  return (
    <canvas
      ref={canvasRef}
      className="h-130 w-full touch-none rounded-xl border"
    />
  );
}
