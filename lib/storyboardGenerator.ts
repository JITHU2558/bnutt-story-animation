import { Scene } from "../types/story";

export function generateStoryboard(story: string): Scene[] {
  const parts = story
    .split(".")
    .filter((scene) => scene.trim() !== "");

  return parts.map((scene, index) => ({
    id: index + 1,
    title: `Scene ${index + 1}`,
    description: scene.trim(),
    imagePrompt: scene.trim(),
    animationPrompt: `Animate: ${scene.trim()}`
  }));
}
