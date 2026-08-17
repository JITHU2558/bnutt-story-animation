import { AnimationStyle } from "./animationStyle";

export interface Scene {
  id: number;
  title: string;
  description: string;
  imagePrompt: string;
  animationPrompt: string;
  animationStyle: AnimationStyle;
}