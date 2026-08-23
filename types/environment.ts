import { AnimationStyle } from "./animationStyle";

export interface Environment {
  id: number;
  name: string;
  type: string;
  description: string;
  lighting: string;
  atmosphere: string;
  colorPalette: string;
  visualStyle: AnimationStyle;
  referenceDescription: string;
}