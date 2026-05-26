import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { getMyIdentity, getPublicUser } from "@/lib/auth-api.ts";
import PageMeta from "@/components/seo/page-meta.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { cn } from "@/lib/utils.ts";
import { getRanking, type RankingItem } from "@/lib/progress-api.ts";
import {
  getAccessToken,
  getRefreshToken,
  useUser,
} from "@/stores/user-store.ts";

function shortUserId(userId: string) {
  return userId.slice(0, 8);
}

export default function RankingPage() {
  const { t } = useTranslation();
  const user = useUser((state) => state.user);
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [usernames, setUsernames] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    let isActive = true;

    getMyIdentity({
      getAccessToken,
      getRefreshToken,
      applyAuthResponse: useUser.getState().applyAuthResponse,
      clearAuth: useUser.getState().clearUser,
    })
      .then((identity) => {
        if (isActive) {
          setCurrentUsername(identity.username);
        }
      })
      .catch(() => {
        if (isActive) {
          setCurrentUsername(user.username);
        }
      });

    return () => {
      isActive = false;
    };
  }, [user]);

  useEffect(() => {
    if (ranking.length === 0) return;

    const missing = ranking
      .map((r) => r.user_id)
      .filter((id) => id !== user?.id && !(id in usernames));

    if (missing.length === 0) return;

    let isActive = true;

    Promise.allSettled(
      missing.map((id) => getPublicUser(id))
    ).then((results) => {
      if (!isActive) return;

      const next: Record<string, string> = {};

      results.forEach((res, idx) => {
        const id = missing[idx];

        if (res.status === "fulfilled" && res.value && res.value.username) {
          next[id] = res.value.username;
        } else {
          if (res.status === "rejected") {
            console.warn("Failed to fetch username for", id, "reason:", res.reason);
          }

          next[id] = shortUserId(id);
        }
      });

      setUsernames((prev) => ({ ...prev, ...next }));
    });

    return () => {
      isActive = false;
    };
  }, [ranking, user?.id, usernames]);

  useEffect(() => {
    let isActive = true;

    getRanking(100)
      .then((data) => {
        if (isActive) {
          setRanking(data);
          setError(null);
        }
      })
      .catch((requestError) => {
        if (isActive) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : t("rankingPage.loadError")
          );
          setRanking([]);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [t]);

  const currentUserInRanking = ranking.some(
    (item) => user && item.user_id === user.id
  );

  return (
    <>
      <PageMeta
        title={t("metaRankingTitle")}
        description={t("metaRankingDescription")}
      />

      <div className="flex w-full flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">
            {t("Ranking")}
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            {t("rankingPage.description")}
          </p>
        </div>

        {isLoading ? (
          <div className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">
            {t("rankingPage.loading")}
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : ranking.length === 0 ? (
          <div className="rounded-lg border p-4 text-sm text-muted-foreground">
            {t("rankingPage.empty")}
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("rankingPage.table.rank")}</TableHead>
                    <TableHead>{t("rankingPage.table.learner")}</TableHead>
                    <TableHead className="text-right">
                      {t("rankingPage.table.points")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ranking.map((item, index) => {
                    const isCurrentUser = user?.id === item.user_id;
                    const label = isCurrentUser
                      ? currentUsername ?? user?.username ?? shortUserId(item.user_id)
                      : usernames[item.user_id]
                      ?? t("rankingPage.userLabel", {
                          userId: shortUserId(item.user_id),
                        });

                    return (
                      <TableRow
                        key={item.user_id}
                        className={cn(isCurrentUser && "bg-primary/5")}
                      >
                        <TableCell className="font-medium">
                          #{index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap items-center gap-2">
                            <span>{label}</span>
                            {isCurrentUser ? (
                              <Badge>{t("rankingPage.you")}</Badge>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {item.total_points}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {!currentUserInRanking ? (
              <p className="text-sm text-muted-foreground">
                {t("rankingPage.notRankedYet")}
              </p>
            ) : null}
          </>
        )}
      </div>
    </>
  );
}
