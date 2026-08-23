import { Scene } from "../types/story";

export function analyzeSceneContinuity(
  scenes: Scene[]
): Scene[] {
  return scenes.map((scene, index) => {
    const previousScene =
      index > 0 ? scenes[index - 1] : null;

    const nextScene =
      index < scenes.length - 1
        ? scenes[index + 1]
        : null;

    const continuingCharacters =
      previousScene
        ? scene.characters.filter((character) =>
            previousScene.characters.includes(character)
          )
        : [];

    const continuingObjects =
      previousScene
        ? scene.objects.filter((object) =>
            previousScene.objects.includes(object)
          )
        : [];

    return {
      ...scene,

      continuity: {
        previousSceneId: previousScene
          ? previousScene.id
          : null,

        nextSceneId: nextScene
          ? nextScene.id
          : null,

        continuingCharacters,

        continuingObjects,

        previousLocation: previousScene
          ? previousScene.location
          : null,
      },
    };
  });
}