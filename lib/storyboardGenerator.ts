import { Scene } from "../types/story";
import { AnimationStyle } from "../types/animationStyle";
import {
  createTitle,
} from "./promptGenerator";
import { analyzeScene } from "./sceneAnalyzer";
import { analyzeSceneContinuity } from "./continuityAnalyzer";
import { buildMasterImagePrompt } from "./masterPromptBuilder";
import { buildMasterAnimationPrompt } from "./masterPromptBuilder";
import { Character } from "../types/character";

export function generateStoryboard(
  story: string,
  animationStyle: AnimationStyle,
  characters: Character[]
): Scene[] {
  const sceneTexts = story
    .split(".")
    .map((scene) => scene.trim())
    .filter((scene) => scene.length > 0);

  const scenes: Scene[] = sceneTexts.map(
    (scene, index) => {
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

        imagePrompt: "",

        animationPrompt: "",

        animationStyle,

        continuity: {
          previousSceneId: null,
          nextSceneId: null,
          continuingCharacters: [],
          continuingObjects: [],
          previousLocation: null,
        },
      };
    }
  );

  const scenesWithContinuity =
    analyzeSceneContinuity(scenes);

  return scenesWithContinuity.map((scene) => ({
    ...scene,

    imagePrompt: buildMasterImagePrompt(
      scene,
      characters
    ),

    animationPrompt: buildMasterAnimationPrompt(
      scene,
      characters
    ),
  }));
}