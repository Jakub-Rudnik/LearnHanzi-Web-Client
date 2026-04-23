import { hanziCharacters } from "@/data/hanzi.ts";

export function getCharacter(char: string) {
  const characterData = hanziCharacters.find((item) => item.character === char);

  if (!characterData) {
    return -1;
  }

  return characterData;
}
