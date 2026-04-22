import PageMeta from "@/components/seo/page-meta.tsx";
import { useTranslation } from "react-i18next";
import { TypographyH2, TypographyP } from "@/components/typography.tsx";
import { DataTable } from "@/components/user-results/data-table.tsx";

type MeaningText = {
  en: string;
  pl: string;
};

type HomeResultEntry = {
  word: string;
  character: string;
  pronunciation: string;
  meaning: MeaningText;
  lastPractised: Date;
  level: number;
  status: string;
  favorite: boolean;
};

const baseData: HomeResultEntry[] = [
  {
    word: "A",
    character: "诶",
    pronunciation: "ēi",
    meaning: {
      en: 'An interjection used to express surprise or get someone\'s attention, similar to "Hey!" or "Oh!"',
      pl: 'Wykrzyknik używany do wyrażenia zaskoczenia lub zwrócenia czyjejś uwagi, podobny do „Hej!” lub „Och!”.',
    },
    lastPractised: new Date("04.04.2026"),
    level: 56,
    status: "Learning",
    favorite: false,
  },
  {
    word: "B",
    character: "比",
    pronunciation: "bǐ",
    meaning: {
      en: 'A preposition meaning "compared to" or "than."',
      pl: 'Przyimek oznaczający „w porównaniu do” lub „niż”.',
    },
    lastPractised: new Date("04.04.2026"),
    level: 56,
    status: "Learning",
    favorite: false,
  },
  {
    word: "C",
    character: "西",
    pronunciation: "xī",
    meaning: {
      en: 'The character for "west."',
      pl: 'Znak oznaczający „zachód”.',
    },
    lastPractised: new Date("04.04.2026"),
    level: 56,
    status: "Learning",
    favorite: false,
  },
  {
    word: "D",
    character: "迪",
    pronunciation: "dí",
    meaning: {
      en: "No meaning.",
      pl: "Brak znaczenia.",
    },
    lastPractised: new Date("04.04.2026"),
    level: 56,
    status: "Learning",
    favorite: false,
  },
  {
    word: "E",
    character: "伊",
    pronunciation: "yī",
    meaning: {
      en: 'A pronoun used to refer to a third person, similar to "he," "she," or "it."',
      pl: 'Zaimek używany do odnoszenia się do trzeciej osoby, podobny do „on”, „ona” lub „ono”.',
    },
    lastPractised: new Date("04.04.2026"),
    level: 56,
    status: "Learning",
    favorite: false,
  },
  {
    word: "F",
    character: "艾弗",
    pronunciation: "ài fú",
    meaning: {
      en: "No meaning.",
      pl: "Brak znaczenia.",
    },
    lastPractised: new Date("04.04.2026"),
    level: 56,
    status: "Learning",
    favorite: false,
  },
  {
    word: "G",
    character: "吉",
    pronunciation: "jí",
    meaning: {
      en: 'Often used as an abbreviation for "吉祥" (jíxiáng), which means "auspicious" or "fortunate."',
      pl: 'Często używany jako skrót od „吉祥” (jíxiáng), co oznacza „pomyślny” lub „szczęśliwy”.',
    },
    lastPractised: new Date("04.04.2026"),
    level: 56,
    status: "Learning",
    favorite: false,
  },
  {
    word: "H",
    character: "艾尺",
    pronunciation: "ài chǐ",
    meaning: {
      en: "No meaning.",
      pl: "Brak znaczenia.",
    },
    lastPractised: new Date("04.04.2026"),
    level: 56,
    status: "Learning",
    favorite: false,
  },
  {
    word: "I",
    character: "艾",
    pronunciation: "ài",
    meaning: {
      en: "No meaning.",
      pl: "Brak znaczenia.",
    },
    lastPractised: new Date("04.04.2026"),
    level: 56,
    status: "Learning",
    favorite: false,
  },
  {
    word: "J",
    character: "杰",
    pronunciation: "jié",
    meaning: {
      en: 'A common given name meaning "outstanding" or "heroic."',
      pl: 'Popularne imię własne oznaczające „wybitny” lub „heroiczny”.',
    },
    lastPractised: new Date("04.04.2026"),
    level: 56,
    status: "Learning",
    favorite: false,
  },
  {
    word: "K",
    character: "开",
    pronunciation: "kāi",
    meaning: {
      en: 'A verb meaning "to open" or "to start."',
      pl: 'Czasownik oznaczający „otwierać” lub „zaczynać”.',
    },
    lastPractised: new Date("04.04.2026"),
    level: 56,
    status: "Learning",
    favorite: false,
  },
  {
    word: "L",
    character: "艾勒",
    pronunciation: "ài lè",
    meaning: {
      en: "No meaning.",
      pl: "Brak znaczenia.",
    },
    lastPractised: new Date("04.04.2026"),
    level: 56,
    status: "Learning",
    favorite: false,
  },
  {
    word: "M",
    character: "艾马",
    pronunciation: "ài mǎ",
    meaning: {
      en: "No meaning.",
      pl: "Brak znaczenia.",
    },
    lastPractised: new Date("04.04.2026"),
    level: 56,
    status: "Learning",
    favorite: false,
  },
  {
    word: "N",
    character: "艾娜",
    pronunciation: "ài nà",
    meaning: {
      en: 'A feminine given name that could be a variant of "Anna."',
      pl: 'Żeńskie imię własne, które może być wariantem imienia „Anna”.',
    },
    lastPractised: new Date("04.04.2026"),
    level: 56,
    status: "Learning",
    favorite: false,
  },
  {
    word: "O",
    character: "哦",
    pronunciation: "ó",
    meaning: {
      en: 'An interjection used to show understanding or acknowledgment, similar to "Oh," "I see," or "Okay."',
      pl: 'Wykrzyknik używany do pokazania zrozumienia lub potwierdzenia, podobny do „Och”, „Rozumiem” lub „Dobrze”.',
    },
    lastPractised: new Date("04.04.2026"),
    level: 56,
    status: "Learning",
    favorite: false,
  },
  {
    word: "P",
    character: "屁",
    pronunciation: "pì",
    meaning: {
      en: 'A somewhat informal and slightly rude term meaning "fart."',
      pl: 'Nieco potoczne i lekko niegrzeczne określenie oznaczające „pierd”.',
    },
    lastPractised: new Date("04.04.2026"),
    level: 56,
    status: "Learning",
    favorite: false,
  },
  {
    word: "Q",
    character: "吉吾",
    pronunciation: "jí wú",
    meaning: {
      en: "No meaning.",
      pl: "Brak znaczenia.",
    },
    lastPractised: new Date("04.04.2026"),
    level: 56,
    status: "Learning",
    favorite: false,
  },
  {
    word: "R",
    character: "艾儿",
    pronunciation: "ài ér",
    meaning: {
      en: "No meaning.",
      pl: "Brak znaczenia.",
    },
    lastPractised: new Date("04.04.2026"),
    level: 56,
    status: "Learning",
    favorite: false,
  },
  {
    word: "S",
    character: "艾丝",
    pronunciation: "ài sī",
    meaning: {
      en: "No meaning.",
      pl: "Brak znaczenia.",
    },
    lastPractised: new Date("04.04.2026"),
    level: 56,
    status: "Learning",
    favorite: false,
  },
  {
    word: "T",
    character: "提",
    pronunciation: "tí",
    meaning: {
      en: 'A verb meaning "to lift" or "to raise."',
      pl: 'Czasownik oznaczający „podnosić” lub „unosić”.',
    },
    lastPractised: new Date("04.04.2026"),
    level: 56,
    status: "Learning",
    favorite: false,
  },
  {
    word: "U",
    character: "伊吾",
    pronunciation: "yī wú",
    meaning: {
      en: "A city in China, also spelled Yiwu.",
      pl: 'Miasto w Chinach, zapisywane także jako Yiwu.',
    },
    lastPractised: new Date("04.04.2026"),
    level: 56,
    status: "Learning",
    favorite: false,
  },
  {
    word: "V",
    character: "维",
    pronunciation: "wéi",
    meaning: {
      en: 'Often used in compound words, such as "维持" (wéichí) meaning "to maintain" or "to sustain."',
      pl: 'Często używany w złożeniach, takich jak „维持” (wéichí), oznaczające „utrzymywać” lub „podtrzymywać”.',
    },
    lastPractised: new Date("04.04.2026"),
    level: 56,
    status: "Learning",
    favorite: false,
  },
  {
    word: "W",
    character: "豆贝尔维",
    pronunciation: "dòu bèi ěr wéi",
    meaning: {
      en: "No meaning.",
      pl: "Brak znaczenia.",
    },
    lastPractised: new Date("04.04.2026"),
    level: 56,
    status: "Learning",
    favorite: false,
  },
  {
    word: "X",
    character: "艾克斯",
    pronunciation: "yī kè sī",
    meaning: {
      en: 'A transliteration of the English letter "X."',
      pl: 'Transliteracja angielskiej litery „X”.',
    },
    lastPractised: new Date("04.04.2026"),
    level: 56,
    status: "Learning",
    favorite: false,
  },
  {
    word: "Y",
    character: "吾艾",
    pronunciation: "wú ài",
    meaning: {
      en: "No meaning.",
      pl: "Brak znaczenia.",
    },
    lastPractised: new Date("04.04.2026"),
    level: 56,
    status: "Learning",
    favorite: false,
  },
  {
    word: "Z",
    character: "贼德",
    pronunciation: "zéi dé",
    meaning: {
      en: "No meaning.",
      pl: "Brak znaczenia.",
    },
    lastPractised: new Date("04.04.2026"),
    level: 56,
    status: "Learning",
    favorite: false,
  },
];

const randomLevel = () => Math.floor(Math.random() * 100) + 1;

const randomDateString = () => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 365));

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return new Date(`${month}.${day}.${year}`);
};

const data = baseData.map((entry) => ({
  ...entry,
  level: randomLevel(),
  lastPractised: randomDateString(),
  favorite: Math.random() < 0.5,
}));

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <>
      <PageMeta
        title={t("metaHomeTitle")}
        description={t("metaHomeDescription")}
      />
      <div className="flex w-full flex-col items-start justify-center">
        <TypographyH2>{t("homePage.WelcomeHeading")} user!</TypographyH2>
        <TypographyP>{t("homePage.WelcomeHeadingDescription")}</TypographyP>
      </div>
      <div className="flex w-full py-8">
        <DataTable data={data} />
      </div>
    </>
  );
}
