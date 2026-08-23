import { Scene } from "../types/story";
import { AnimationStyle } from "../types/animationStyle";
import {
  createTitle,
  createImagePrompt,
  createAnimationPrompt,
} from "./promptGenerator";
import { analyzeScene } from "./sceneAnalyzer";

export function generateStoryboard(
  story: string,
  animationStyle: AnimationStyle
): Scene[] {
  const scenes = story
    .split(".")
    .map((scene) => scene.trim())
    .filter((scene) => scene.length > 0);

  return scenes.map((scene, index) => {
    const analysis = analyzeScene(scene);

    return {
      id: index + 1,

      title: createTitle(scene),

      description: scene,

      characters: analysis.characters,

      location: analysis.location,

      objects: analysis.objects,

      action: analysis.action,

      camera: analysis.camera,

      imagePrompt: createImagePrompt(
        scene,
        animationStyle
      ),

      animationPrompt: createAnimationPrompt(
        scene,
        animationStyle
      ),

      animationStyle,
    };
  });
}