import { Environment } from "../types/environment";
import { AnimationStyle } from "../types/animationStyle";

export function generateEnvironmentProfiles(
  locations: string[],
  animationStyle: AnimationStyle
): Environment[] {
  const uniqueLocations = Array.from(
    new Set(locations)
  );

  return uniqueLocations.map((location, index) => {
    const profile = getEnvironmentProfile(
      location
    );

    const referenceDescription =
      `${profile.description}, ` +
      `${profile.lighting}, ` +
      `${profile.atmosphere}, ` +
      `${profile.colorPalette}, ` +
      `${animationStyle} visual style`;

    return {
      id: index + 1,
      name: location,
      type: location,
      description: profile.description,
      lighting: profile.lighting,
      atmosphere: profile.atmosphere,
      colorPalette: profile.colorPalette,
      visualStyle: animationStyle,
      referenceDescription,
    };
  });
}

function getEnvironmentProfile(
  location: string
) {
  switch (location.toLowerCase()) {
    case "forest":
      return {
        description:
          "A dense magical forest with tall ancient trees, natural paths, vegetation, and detailed foliage",
        lighting:
          "Soft filtered sunlight passing through the tree canopy",
        atmosphere:
          "Mystical, peaceful, slightly mysterious atmosphere",
        colorPalette:
          "Deep greens, natural browns, moss tones, and warm golden highlights",
      };

    case "cave":
      return {
        description:
          "A mysterious underground cave with rocky walls, uneven ground, and deep passages",
        lighting:
          "Low ambient light with subtle glowing highlights",
        atmosphere:
          "Mysterious, quiet, and slightly dramatic atmosphere",
        colorPalette:
          "Dark gray, charcoal, earthy brown, and subtle blue highlights",
      };

    case "castle":
      return {
        description:
          "A grand fantasy castle with stone architecture, towers, large halls, and detailed surroundings",
        lighting:
          "Dramatic cinematic lighting with warm highlights",
        atmosphere:
          "Majestic, magical, and adventurous atmosphere",
        colorPalette:
          "Stone gray, warm gold, deep blue, and rich brown",
      };

    case "village":
      return {
        description:
          "A charming storybook village with small buildings, paths, trees, and welcoming surroundings",
        lighting:
          "Warm natural daylight",
        atmosphere:
          "Peaceful, friendly, and welcoming atmosphere",
        colorPalette:
          "Warm brown, green, cream, orange, and soft blue",
      };

    case "city":
      return {
        description:
          "A detailed city environment with buildings, streets, sidewalks, and surrounding urban elements",
        lighting:
          "Cinematic urban lighting",
        atmosphere:
          "Busy, energetic, and visually rich atmosphere",
        colorPalette:
          "Gray, blue, warm lights, and neutral urban colors",
      };

    case "house":
      return {
        description:
          "A cozy storybook house with detailed interior or exterior architecture and familiar surroundings",
        lighting:
          "Warm soft interior lighting",
        atmosphere:
          "Safe, comfortable, and welcoming atmosphere",
        colorPalette:
          "Warm brown, cream, beige, orange, and muted green",
      };

    case "mountain":
      return {
        description:
          "A dramatic mountain landscape with rocky peaks, distant scenery, and natural terrain",
        lighting:
          "Wide cinematic natural lighting",
        atmosphere:
          "Grand, adventurous, and expansive atmosphere",
        colorPalette:
          "Gray, green, blue, white, and earthy tones",
      };

    case "waterfront":
      return {
        description:
          "A scenic waterfront environment with water, natural surroundings, and an expansive horizon",
        lighting:
          "Soft natural light reflecting across the water",
        atmosphere:
          "Calm, peaceful, and expansive atmosphere",
        colorPalette:
          "Blue, turquoise, green, brown, and soft white",
      };

    case "desert":
      return {
        description:
          "A vast desert landscape with sand dunes, rocky terrain, and an expansive horizon",
        lighting:
          "Bright dramatic sunlight",
        atmosphere:
          "Vast, mysterious, and adventurous atmosphere",
        colorPalette:
          "Sand, gold, orange, brown, and deep blue",
      };

    case "school":
      return {
        description:
          "A detailed school environment with classrooms, hallways, furniture, and educational surroundings",
        lighting:
          "Bright natural indoor lighting",
        atmosphere:
          "Friendly, lively, and familiar atmosphere",
        colorPalette:
          "Warm wood, cream, blue, green, and neutral tones",
      };

    default:
      return {
        description:
          `A detailed ${location.toLowerCase()} environment suitable for animated storytelling`,
        lighting:
          "Cinematic natural lighting",
        atmosphere:
          "Story-driven cinematic atmosphere",
        colorPalette:
          "Balanced cinematic colors appropriate to the environment",
      };
  }
}