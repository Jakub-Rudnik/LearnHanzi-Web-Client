import type { ColumnDef } from "@tanstack/react-table";
import type { i18n, TFunction } from "i18next";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDownIcon, ArrowUpIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button.tsx";

export type MeaningText = {
  en: string;
  pl: string;
};

export type ResultEntry = {
  character: string;
  pronunciation: string;
  meaning: MeaningText;
  lastPractised: Date;
  level: number;
};

const getDisplayLanguage = (language: string) =>
  language.toLowerCase().startsWith("pl") ? "pl" : "en";

export const getMeaningText = (meaning: MeaningText, language: string) => {
  const locale = getDisplayLanguage(language);

  return meaning[locale] || meaning.en;
};

export const getColumns = (
  t: TFunction,
  i18n: i18n
): ColumnDef<ResultEntry>[] => [
  {
    accessorKey: "character",
    header: () => t("userResultsTable.character"),
  },
  {
    accessorKey: "pronunciation",
    header: () => t("userResultsTable.pronunciation"),
  },
  {
    accessorKey: "meaning",
    header: () => t("userResultsTable.meaning"),
    cell: ({ row }) => {
      const meaning = row.getValue("meaning") as MeaningText;

      return (
        <div className="whitespace-normal">
          {getMeaningText(meaning, i18n.language)}
        </div>
      );
    },
  },
  {
    accessorKey: "lastPractised",
    header: ({ column }) => {
      return (
        <Button
          variant={column.getIsSorted() ? "secondary" : "ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className={column.getIsSorted() ? "font-bold" : ""}
        >
          {t("userResultsTable.lastPractised")}
          <HugeiconsIcon
            icon={column.getIsSorted() == "asc" ? ArrowUpIcon : ArrowDownIcon}
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("lastPractised") as Date;

      return (
        <div className="flex w-full items-center justify-center">
          {date.toLocaleDateString(i18n.language)}
        </div>
      );
    },
  },
  {
    accessorKey: "level",
    header: () => t("userResultsTable.level"),
  },
];
