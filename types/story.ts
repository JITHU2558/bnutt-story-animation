import { AnimationStyle } from "./animationStyle";
import { SceneContinuity } from "./sceneContinuity";
import { StoryObject } from "./object";

export interface Scene {
  id: number;

  title: string;

  description: string;

  characters: string[];

  location: string;

  objects: string[];

  objectEntities: StoryObject[];

  action: string;

  camera: string;

  imagePrompt: string;

  animationPrompt: string;

  imageUrl: string | null;

  videoUrl: string | null;

  animationStyle: AnimationStyle;

  continuity: SceneContinuity;
}