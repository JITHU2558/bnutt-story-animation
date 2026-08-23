import { AnimationStyle } from "./animationStyle";

export interface Scene {
  id: number;
  title: string;
  description: string;
  characters: string[];
  location: string;
  objects: string[];
  action: string;
  camera: string;
  imagePrompt: string;
  animationPrompt: string;
  animationStyle: AnimationStyle;
}