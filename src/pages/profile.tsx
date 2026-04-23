import PageMeta from "@/components/seo/page-meta.tsx";
import { useTranslation } from "react-i18next";
import { useUser } from "@/stores/user-store.ts";

export default function ProfilePage() {
  const { t } = useTranslation();
  const user = useUser((state) => state.user);

  return (
    <>
      <PageMeta
        title={t("metaProfileTitle")}
        description={t("metaProfileDescription")}
      />
      <div className="flex flex-col gap-2">
        <h1>{t("Profile")}</h1>
        {user ? (
          <div className="text-sm text-muted-foreground">
            <p>{user.username}</p>
            <p>{user.email}</p>
          </div>
        ) : null}
      </div>
    </>
  );
}
