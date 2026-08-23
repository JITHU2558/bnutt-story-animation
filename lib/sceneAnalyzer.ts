import { detectCharacters } from "./characterDetector";

export interface SceneAnalysis {
  characters: string[];
  location: string;
  objects: string[];
  action: string;
  camera: string;
}

export function analyzeScene(
  sceneText: string
): SceneAnalysis {
  const characters = detectCharacters(sceneText);

  const lowerText = sceneText.toLowerCase();

  let location = "Unknown location";

  if (lowerText.includes("forest")) {
    location = "Forest";
  } else if (lowerText.includes("castle")) {
    location = "Castle";
  } else if (lowerText.includes("village")) {
    location = "Village";
  } else if (lowerText.includes("cave")) {
    location = "Cave";
  } else if (lowerText.includes("city")) {
    location = "City";
  } else if (lowerText.includes("house")) {
    location = "House";
  }

  const objects: string[] = [];

  const knownObjects = [
    "crystal",
    "sword",
    "book",
    "key",
    "crown",
    "map",
    "treasure",
    "flower",
  ];

  knownObjects.forEach((object) => {
    if (lowerText.includes(object)) {
      objects.push(object);
    }
  });

  let action = "Characters are present in the scene";

  if (
    lowerText.includes("walk") ||
    lowerText.includes("walking") ||
    lowerText.includes("enters") ||
    lowerText.includes("enter")
  ) {
    action = "Character is moving through the environment";
  } else if (
    lowerText.includes("finds") ||
    lowerText.includes("find")
  ) {
    action = "Character discovers an important object";
  } else if (
    lowerText.includes("runs") ||
    lowerText.includes("running")
  ) {
    action = "Character is running";
  } else if (
    lowerText.includes("fights") ||
    lowerText.includes("fight")
  ) {
    action = "Characters are fighting";
  }

  const camera = "Wide cinematic shot";

  return {
    characters,
    location,
    objects,
    action,
    camera,
  };
}