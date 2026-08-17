import { Character } from "../types/character";

export function generateCharacterProfiles(
  characters: string[]
): Character[] {
  return characters.map((character, index) => ({
    id: index + 1,

    name:
      character.charAt(0).toUpperCase() +
      character.slice(1),

    type: character,

    appearance: `A detailed ${character} character with distinctive features`,

    eyes: "Expressive eyes",

    clothing: "Simple story-appropriate clothing",

    personality: "Friendly and expressive",

    role: "Character",

    visualStyle: "Cinematic animated film style",
  }));
}