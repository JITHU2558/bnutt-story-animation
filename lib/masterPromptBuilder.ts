import { Scene } from "../types/story";
import { Character } from "../types/character";

export function buildMasterImagePrompt(
  scene: Scene,
  characters: Character[]
): string {
  const sceneCharacters = characters.filter((character) =>
    scene.characters.includes(character.type)
  );

  const characterDescriptions =
    sceneCharacters.length > 0
      ? sceneCharacters
          .map(
            (character) =>
              `${character.name}: ${character.referenceDescription}`
          )
          .join("; ")
      : "No specific characters detected";

  const objects =
    scene.objects.length > 0
      ? scene.objects.join(", ")
      : "No important objects";

  const continuity =
    scene.continuity.previousLocation
      ? `Previous scene location: ${scene.continuity.previousLocation}. Maintain visual continuity where appropriate.`
      : "This is the beginning of the story.";

  return [
    `Animation style: ${scene.animationStyle}.`,
    `Characters: ${characterDescriptions}.`,
    `Location: ${scene.location}.`,
    `Important objects: ${objects}.`,
    `Action: ${scene.action}.`,
    `Camera: ${scene.camera}.`,
    `Scene description: ${scene.description}.`,
    continuity,
    "Maintain consistent character appearance, proportions, colors, clothing, and visual identity.",
    "Create a detailed cinematic composition suitable for animated storytelling.",
  ].join(" ");
}

export function buildMasterAnimationPrompt(
  scene: Scene,
  characters: Character[]
): string {
  const sceneCharacters = characters.filter((character) =>
    scene.characters.includes(character.type)
  );

  const characterDescriptions =
    sceneCharacters.length > 0
      ? sceneCharacters
          .map(
            (character) =>
              `${character.name}: ${character.referenceDescription}`
          )
          .join("; ")
      : "No specific characters detected";

  const objects =
    scene.objects.length > 0
      ? scene.objects.join(", ")
      : "No important objects";

  return [
    `Animation style: ${scene.animationStyle}.`,
    `Characters: ${characterDescriptions}.`,
    `Location: ${scene.location}.`,
    `Objects: ${objects}.`,
    `Action: ${scene.action}.`,
    `Camera movement: ${scene.camera}.`,
    `Scene: ${scene.description}.`,
    "Maintain consistent character appearance throughout the animation.",
    "Use natural character movement and smooth cinematic motion.",
    "Preserve the environment and visual style throughout the shot.",
  ].join(" ");
}