export function createTitle(text: string): string {
  const words = text.trim().split(" ");

  return words
    .slice(0, 4)
    .join(" ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function createImagePrompt(text: string): string {
  return `${text}, cinematic lighting, detailed illustration, fantasy style`;
}

export function createAnimationPrompt(text: string): string {
  return `${text}, smooth animation, cinematic camera movement`;
}