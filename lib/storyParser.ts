export function splitStoryIntoScenes(story: string) {
  return story
    .split(".")
    .filter((scene) => scene.trim() !== "");
}