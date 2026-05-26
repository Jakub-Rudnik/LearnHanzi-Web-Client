import type { Hanzi } from "@/lib/dictionary-api.ts";

const hanziCharacters: Hanzi[] = [];

export function getCharacter(char: string) {
  const characterData = hanziCharacters.find((item) => item.character === char);

  if (!characterData) {
    return -1;
  }

  return characterData;
}

void getCharacter;

