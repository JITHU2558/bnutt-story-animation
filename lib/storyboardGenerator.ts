import { Scene } from "../types/story";
import { AnimationStyle } from "../types/animationStyle";
import {
  createTitle,
  createImagePrompt,
  createAnimationPrompt,
} from "./promptGenerator";

export function generateStoryboard(
  story: string,
  animationStyle: AnimationStyle
): Scene[] {
  const scenes = story
    .split(".")
    .map((scene) => scene.trim())
    .filter((scene) => scene.length > 0);

  return scenes.map((scene, index) => ({
    id: index + 1,
    title: createTitle(scene),
    description: scene,
    imagePrompt: createImagePrompt(scene, animationStyle),
    animationPrompt: createAnimationPrompt(scene, animationStyle),
    animationStyle,
  }));
}