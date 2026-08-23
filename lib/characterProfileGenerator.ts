import { Character } from "../types/character";
import { AnimationStyle } from "../types/animationStyle";

export function generateCharacterProfiles(
  characters: string[],
  animationStyle: AnimationStyle
): Character[] {
  return characters.map((character, index) => {
    const name =
      character.charAt(0).toUpperCase() +
      character.slice(1);

    const appearance =
      `A detailed ${character} character with distinctive features`;

    const eyes = "Expressive eyes";

    const clothing =
      "Simple story-appropriate clothing";

    const personality =
      "Friendly and expressive";

    const role = "Character";

    const referenceDescription =
      `${appearance}, ${eyes}, ${clothing}, ` +
      `${personality}, ${animationStyle} visual style`;

    return {
      id: index + 1,
      name,
      type: character,
      appearance,
      eyes,
      clothing,
      personality,
      role,
      visualStyle: animationStyle,
      referenceDescription,
    };
  });
}