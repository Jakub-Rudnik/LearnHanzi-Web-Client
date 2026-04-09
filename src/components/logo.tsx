import { NavLink } from "react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlphabetChineseIcon } from "@hugeicons/core-free-icons";

export default function Logo({ to }: { to: string }) {
  return (
    <NavLink to={to} className="flex items-center gap-2 font-medium">
      <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <HugeiconsIcon icon={AlphabetChineseIcon} />
      </div>
      LearnHanzi
    </NavLink>
  );
}
