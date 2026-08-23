import { Scene } from "../types/story";
import { AnimationStyle } from "../types/animationStyle";
import {
  createTitle,
} from "./promptGenerator";
import { analyzeScene } from "./sceneAnalyzer";
import { analyzeSceneContinuity } from "./continuityAnalyzer";
import {
  buildMasterImagePrompt,
  buildMasterAnimationPrompt,
} from "./masterPromptBuilder";
import { Character } from "../types/character";
import { generateEnvironmentProfiles } from "./environmentGenerator";

function splitStoryIntoSceneTexts(
  story: string
): string[] {
  const paragraphs = story
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);

  if (paragraphs.length > 1) {
    return paragraphs;
  }

  const sentences = story
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);

  const scenes: string[] = [];

  let currentScene = "";

  for (const sentence of sentences) {
    if (!currentScene) {
      currentScene = sentence;
      continue;
    }

    const currentAnalysis =
      analyzeScene(currentScene);

    const sentenceAnalysis =
      analyzeScene(sentence);

    const locationChanged =
      sentenceAnalysis.location !==
        "Unknown location" &&
      currentAnalysis.location !==
        "Unknown location" &&
      sentenceAnalysis.location !==
        currentAnalysis.location;

    const actionChanged =
      sentenceAnalysis.action !==
        currentAnalysis.action &&
      sentenceAnalysis.action !==
        "Characters are present in the scene";

    if (
      locationChanged ||
      actionChanged ||
      currentScene.split(/\s+/).length >= 35
    ) {
      scenes.push(currentScene);
      currentScene = sentence;
    } else {
      currentScene += ` ${sentence}`;
    }
  }

  if (currentScene) {
    scenes.push(currentScene);
  }

  return scenes;
}

export function generateStoryboard(
  story: string,
  animationStyle: AnimationStyle,
  characters: Character[]
): Scene[] {
  const sceneTexts =
    splitStoryIntoSceneTexts(story);

  const sceneAnalyses = sceneTexts.map(
    (scene) => analyzeScene(scene)
  );

  const locations = sceneAnalyses
    .map((analysis) => analysis.location)
    .filter(
      (location) => location !== "Unknown location"
    );

  const environments =
    generateEnvironmentProfiles(
      locations,
      animationStyle
    );

  const scenes: Scene[] = sceneTexts.map(
    (scene, index) => {
      const analysis = sceneAnalyses[index];

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

  return scenesWithContinuity.map((scene) => {
    const environment = environments.find(
      (item) =>
        item.type === scene.location
    );

    return {
      ...scene,

      imagePrompt: buildMasterImagePrompt(
        scene,
        characters,
        environment
      ),

      animationPrompt:
        buildMasterAnimationPrompt(
          scene,
          characters,
          environment
        ),
    };
  });
}