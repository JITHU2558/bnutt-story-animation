import { Scene } from "../types/story";
import {
  createTitle,
  createImagePrompt,
  createAnimationPrompt,
} from "./promptGenerator";

export function generateStoryboard(story: string): Scene[] {
  const scenes = story
    .split(".")
    .filter((scene) => scene.trim() !== "");

  return scenes.map((scene, index) => ({
    id: index + 1,
    title: createTitle(scene),
    description: scene.trim(),
    imagePrompt: createImagePrompt(scene),
    animationPrompt: createAnimationPrompt(scene),
  }));
}