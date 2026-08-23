import { StoryObject } from "../types/object";

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

const objectAliases: Record<string, string[]> = {
  crystal: [
    "crystal",
    "object",
    "gem",
    "jewel",
    "stone",
    "it",
  ],

  sword: [
    "sword",
    "weapon",
    "blade",
    "it",
  ],

  book: [
    "book",
    "volume",
    "tome",
    "it",
  ],

  key: [
    "key",
    "object",
    "it",
  ],

  crown: [
    "crown",
    "royal crown",
    "it",
  ],

  map: [
    "map",
    "parchment",
    "it",
  ],

  treasure: [
    "treasure",
    "gold",
    "riches",
    "it",
  ],

  flower: [
    "flower",
    "blossom",
    "plant",
    "it",
  ],

  ring: [
    "ring",
    "jewelry",
    "jewel",
    "it",
  ],

  potion: [
    "potion",
    "bottle",
    "elixir",
    "it",
  ],

  lantern: [
    "lantern",
    "lamp",
    "light",
    "it",
  ],

  torch: [
    "torch",
    "flame",
    "it",
  ],

  shield: [
    "shield",
    "armor",
    "it",
  ],

  letter: [
    "letter",
    "message",
    "note",
    "it",
  ],

  door: [
    "door",
    "entrance",
    "it",
  ],

  boat: [
    "boat",
    "ship",
    "vessel",
    "it",
  ],
};

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ");
}

function containsWord(
  text: string,
  word: string
): boolean {
  const normalized = normalizeText(text);

  return normalized
    .split(/\s+/)
    .includes(word);
}

function createObjectProfile(
  name: string,
  id: number
): StoryObject {
  return {
    id,
    name,
    type: name,
    description:
      `A story object identified as a ${name}`,

    visualDescription:
      `A clearly recognizable ${name} with distinctive visual details`,

    referenceDescription:
      `Maintain the same ${name} design, shape, proportions, materials, colors, and distinctive visual features throughout the story`,
  };
}

export function detectObjects(
  story: string
): StoryObject[] {
  const detected: StoryObject[] = [];

  for (const object of knownObjects) {
    if (containsWord(story, object)) {
      detected.push(
        createObjectProfile(
          object,
          detected.length + 1
        )
      );
    }
  }

  return detected;
}

export function resolveObjectReferences(
  text: string,
  previousObjects: StoryObject[]
): StoryObject[] {
  if (previousObjects.length === 0) {
    return [];
  }

  const normalized = normalizeText(text);

  const results: StoryObject[] = [];

  for (const object of previousObjects) {
    const aliases =
      objectAliases[object.name] ?? [
        object.name,
        "it",
      ];

    const foundAlias = aliases.some(
      (alias) =>
        normalized.includes(alias)
    );

    if (foundAlias) {
      results.push(object);
    }
  }

  return results;
}