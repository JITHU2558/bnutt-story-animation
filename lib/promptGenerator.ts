import { AnimationStyle } from "../types/animationStyle";

export function createTitle(text: string): string {
  const words = text.trim().split(/\s+/);

  return words
    .slice(0, 5)
    .join(" ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function createImagePrompt(
  text: string,
  animationStyle: AnimationStyle
): string {
  return `${text}, ${animationStyle} visual style, detailed composition, cinematic lighting, high quality`;
}

export function createAnimationPrompt(
  text: string,
  animationStyle: AnimationStyle
): string {
  return `Animate the scene: ${text}, ${animationStyle} visual style, smooth character movement, cinematic camera movement`;
}