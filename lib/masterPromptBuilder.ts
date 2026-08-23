import { Scene } from "../types/story";
import { Character } from "../types/character";

function getSceneCharacters(
  scene: Scene,
  characters: Character[]
): Character[] {
  return characters.filter((character) =>
    scene.characters.includes(character.type)
  );
}

function buildCharacterDescriptions(
  scene: Scene,
  characters: Character[]
): string {
  const sceneCharacters =
    getSceneCharacters(scene, characters);

  if (sceneCharacters.length === 0) {
    return "No specific characters detected";
  }

  return sceneCharacters
    .map(
      (character) =>
        `${character.name}: ${character.referenceDescription}`
    )
    .join("; ");
}

function buildObjectDescription(
  scene: Scene
): string {
  if (scene.objects.length === 0) {
    return "No important objects";
  }

  return scene.objects.join(", ");
}

function buildContinuityDescription(
  scene: Scene
): string {
  const continuity = scene.continuity;

  const parts: string[] = [];

  if (continuity.previousLocation) {
    parts.push(
      `The previous scene took place in ${continuity.previousLocation}.`
    );
  }

  if (
    continuity.continuingCharacters.length > 0
  ) {
    parts.push(
      `Continuing characters: ${continuity.continuingCharacters.join(", ")}.`
    );
  }

  if (
    continuity.continuingObjects.length > 0
  ) {
    parts.push(
      `Continuing objects: ${continuity.continuingObjects.join(", ")}.`
    );
  }

  if (parts.length === 0) {
    return "This is the beginning of the story.";
  }

  return parts.join(" ");
}

export function buildMasterImagePrompt(
  scene: Scene,
  characters: Character[]
): string {
  const characterDescriptions =
    buildCharacterDescriptions(
      scene,
      characters
    );

  const objects =
    buildObjectDescription(scene);

  const continuity =
    buildContinuityDescription(scene);

  return [
    `Visual style: ${scene.animationStyle}.`,
    `Characters: ${characterDescriptions}.`,
    `Location: ${scene.location}.`,
    `Important objects: ${objects}.`,
    `Action: ${scene.action}.`,
    `Camera: ${scene.camera}.`,
    `Scene description: ${scene.description}.`,
    `Continuity: ${continuity}`,
    "Maintain consistent character appearance, proportions, colors, clothing, facial features, and visual identity.",
    "Maintain environmental continuity between connected scenes.",
    "Create a detailed cinematic composition suitable for animated storytelling.",
    "Use clear foreground, middle-ground, and background separation.",
    "Keep the main subject visually readable.",
  ].join(" ");
}

export function buildMasterAnimationPrompt(
  scene: Scene,
  characters: Character[]
): string {
  const characterDescriptions =
    buildCharacterDescriptions(
      scene,
      characters
    );

  const objects =
    buildObjectDescription(scene);

  const continuity =
    buildContinuityDescription(scene);

  return [
    `Animation style: ${scene.animationStyle}.`,
    `Characters: ${characterDescriptions}.`,
    `Location: ${scene.location}.`,
    `Objects: ${objects}.`,
    `Action: ${scene.action}.`,
    `Camera movement: ${scene.camera}.`,
    `Scene: ${scene.description}.`,
    `Continuity: ${continuity}`,
    "Maintain consistent character appearance throughout the animation.",
    "Use natural character movement.",
    "Use smooth cinematic camera motion.",
    "Preserve the environment and visual style throughout the shot.",
    "Avoid sudden changes to character identity, clothing, proportions, or colors.",
  ].join(" ");
}