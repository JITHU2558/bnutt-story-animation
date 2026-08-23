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

  const locationRules = [
    {
      keywords: ["forest", "woods", "wood"],
      location: "Forest",
    },
    {
      keywords: ["castle", "palace"],
      location: "Castle",
    },
    {
      keywords: ["village", "town"],
      location: "Village",
    },
    {
      keywords: ["cave", "cavern"],
      location: "Cave",
    },
    {
      keywords: ["city", "street", "downtown"],
      location: "City",
    },
    {
      keywords: ["house", "home", "bedroom", "kitchen"],
      location: "House",
    },
    {
      keywords: ["mountain", "mountains", "hill"],
      location: "Mountain",
    },
    {
      keywords: ["river", "lake", "ocean", "sea", "beach"],
      location: "Waterfront",
    },
    {
      keywords: ["desert", "sand dunes"],
      location: "Desert",
    },
    {
      keywords: ["school", "classroom"],
      location: "School",
    },
  ];

  for (const rule of locationRules) {
    if (
      rule.keywords.some((keyword) =>
        lowerText.includes(keyword)
      )
    ) {
      location = rule.location;
      break;
    }
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
    "ring",
    "potion",
    "lantern",
    "torch",
    "shield",
    "letter",
    "door",
    "boat",
  ];

  for (const object of knownObjects) {
    if (lowerText.includes(object)) {
      objects.push(object);
    }
  }

  let action =
    "Characters are present in the scene";

  if (
    lowerText.includes("enters") ||
    lowerText.includes("enter") ||
    lowerText.includes("walks") ||
    lowerText.includes("walk") ||
    lowerText.includes("walking")
  ) {
    action =
      "Character is moving through the environment";
  } else if (
    lowerText.includes("finds") ||
    lowerText.includes("find") ||
    lowerText.includes("discovers") ||
    lowerText.includes("discover")
  ) {
    action =
      "Character discovers something important";
  } else if (
    lowerText.includes("runs") ||
    lowerText.includes("run") ||
    lowerText.includes("running")
  ) {
    action = "Character is running";
  } else if (
    lowerText.includes("fights") ||
    lowerText.includes("fight") ||
    lowerText.includes("attacks") ||
    lowerText.includes("attack")
  ) {
    action = "Characters are fighting";
  } else if (
    lowerText.includes("opens") ||
    lowerText.includes("open")
  ) {
    action = "Character opens something";
  } else if (
    lowerText.includes("picks up") ||
    lowerText.includes("takes") ||
    lowerText.includes("grabs")
  ) {
    action =
      "Character picks up or takes an important object";
  } else if (
    lowerText.includes("returns") ||
    lowerText.includes("return") ||
    lowerText.includes("goes home")
  ) {
    action = "Character returns to a previous location";
  } else if (
    lowerText.includes("sits") ||
    lowerText.includes("sitting")
  ) {
    action = "Character is sitting";
  } else if (
    lowerText.includes("talks") ||
    lowerText.includes("speaks") ||
    lowerText.includes("says")
  ) {
    action = "Characters are communicating";
  }

  let camera = "Wide cinematic shot";

  if (
    lowerText.includes("close-up") ||
    lowerText.includes("close up") ||
    lowerText.includes("face")
  ) {
    camera = "Cinematic close-up shot";
  } else if (
    lowerText.includes("runs") ||
    lowerText.includes("running") ||
    lowerText.includes("chases")
  ) {
    camera = "Dynamic tracking shot";
  } else if (
    lowerText.includes("enters") ||
    lowerText.includes("entering")
  ) {
    camera = "Wide establishing shot";
  }

  return {
    characters,
    location,
    objects,
    action,
    camera,
  };
}