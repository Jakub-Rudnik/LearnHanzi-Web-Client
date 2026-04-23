import type { ColumnDef } from "@tanstack/react-table";
import type { i18n, TFunction } from "i18next";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDownIcon, ArrowUpIcon, StarIcon, } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button.tsx";

export type MeaningText = {
  en: string;
  pl: string;
};

export type ResultEntry = {
  word: string;
  character: string;
  pronunciation: string;
  meaning: MeaningText;
  lastPractised: Date;
  level: number;
  status: string;
  favorite: boolean;
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
    accessorKey: "word",
    header: ({ column }) => {
      return (
        <Button
          variant={column.getIsSorted() ? "secondary" : "ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className={column.getIsSorted() ? "font-bold" : ""}
        >
          {t("userResultsTable.word")}
          <HugeiconsIcon
            icon={column.getIsSorted() == "asc" ? ArrowUpIcon : ArrowDownIcon}
          />
        </Button>
      );
    },
  },
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
  {
    accessorKey: "status",
    header: () => t("userResultsTable.status"),
    cell: ({ row }) => {
      const meaning = row.getValue("status") as MeaningText;

      return (
        <div className="whitespace-normal">
          {getMeaningText(meaning, i18n.language)}
        </div>
      );
    },
  },
  {
    accessorKey: "favorite",
    header: () => t("userResultsTable.favorite"),
    cell: ({ row }) => {
      const favourite = !!row.getValue("favorite");

      return (
        <div className="flex w-full items-center justify-center">
          <HugeiconsIcon
            icon={StarIcon}
            className={favourite ? "text-amber-500" : "text-gray-400"}
          />
        </div>
      );
    },
  },
];
