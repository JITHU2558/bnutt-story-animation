import { AnimationStyle } from "./animationStyle";

export interface Character {
  id: number;
  name: string;
  type: string;
  appearance: string;
  eyes: string;
  clothing: string;
  personality: string;
  role: string;
  visualStyle: AnimationStyle;
}