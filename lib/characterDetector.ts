export function detectCharacters(story: string): string[] {
  const characters: string[] = [];

  const words = story.toLowerCase().split(/\s+/);

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
    "dog"
  ];

  knownCharacters.forEach((character) => {
    if (words.includes(character)) {
      characters.push(character);
    }
  });

  return characters;
}