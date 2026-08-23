const knownCharacters = [
  "fox",
  "wolf",
  "dragon",
  "princess",
  "king",
  "queen",
  "boy",
  "girl",
  "robot",
  "cat",
  "dog",
];

const pronouns = [
  "he",
  "she",
  "they",
  "him",
  "her",
  "them",
];

function normalizeWord(word: string): string {
  return word
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

function findExplicitCharacters(
  sentence: string
): string[] {
  const words = sentence
    .split(/\s+/)
    .map(normalizeWord);

  return knownCharacters.filter((character) =>
    words.includes(character)
  );
}

function containsPronoun(
  sentence: string
): boolean {
  const words = sentence
    .split(/\s+/)
    .map(normalizeWord);

  return pronouns.some((pronoun) =>
    words.includes(pronoun)
  );
}

function resolveCharacterReference(
  sentence: string,
  previousCharacters: string[]
): string[] {
  if (
    previousCharacters.length === 0 ||
    !containsPronoun(sentence)
  ) {
    return [];
  }

  return [previousCharacters[previousCharacters.length - 1]];
}

export function detectCharacters(
  story: string
): string[] {
  const detectedCharacters: string[] = [];

  const sentences = story
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);

  let previousCharacters: string[] = [];

  for (const sentence of sentences) {
    const explicitCharacters =
      findExplicitCharacters(sentence);

    if (explicitCharacters.length > 0) {
      for (const character of explicitCharacters) {
        if (!detectedCharacters.includes(character)) {
          detectedCharacters.push(character);
        }
      }

      previousCharacters = explicitCharacters;
      continue;
    }

    const referencedCharacters =
      resolveCharacterReference(
        sentence,
        previousCharacters
      );

    for (const character of referencedCharacters) {
      if (!detectedCharacters.includes(character)) {
        detectedCharacters.push(character);
      }
    }

    if (referencedCharacters.length > 0) {
      previousCharacters = referencedCharacters;
    }
  }

  return detectedCharacters;
}