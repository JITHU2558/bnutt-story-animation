"use client";

import { useState } from "react";
import { generateStoryboard } from "@/lib/storyboardGenerator";
import { detectCharacters } from "@/lib/characterDetector";
import { generateCharacterProfiles } from "@/lib/characterProfileGenerator";
import { Scene } from "@/types/story";
import { Character } from "@/types/character";
import { AnimationStyle } from "@/types/animationStyle";

export default function Home() {
  const [story, setStory] = useState("");
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [animationStyle, setAnimationStyle] =
  useState<AnimationStyle>("3D Animated Film");

  function handleGenerateStoryboard() {
  const generatedScenes = generateStoryboard(
    story,
    animationStyle
  );

  const detectedCharacters = detectCharacters(story);

  const characterProfiles =
  generateCharacterProfiles(                         
    detectedCharacters,
    animationStyle
  );

  setScenes(generatedScenes);
  setCharacters(characterProfiles);
}

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-5xl font-bold text-center mb-4">
          BNutt StoryAnimation
        </h1>

        <p className="text-center text-gray-600 mb-8">
          Turn stories into animated images and videos.
        </p>

        {/* Story Input */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Create Your Story
          </h2>

          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Write your story here..."
            className="w-full h-48 border border-gray-300 rounded-lg p-4 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-black"
          />
          <div className="mb-4">
  <label
    htmlFor="animationStyle"
    className="block font-semibold mb-2"
  >
    Animation Style
  </label>

  <select
    id="animationStyle"
    value={animationStyle}
    onChange={(e) =>
      setAnimationStyle(e.target.value as AnimationStyle)
    }
    className="w-full border border-gray-300 rounded-lg p-3 bg-white"
  >
    <option value="2D Cartoon">
      2D Cartoon
    </option>

    <option value="3D Animated Film">
      3D Animated Film
    </option>

    <option value="Anime">
      Anime
    </option>

    <option value="Storybook">
      Storybook
    </option>

    <option value="Watercolor">
      Watercolor
    </option>

    <option value="Comic">
      Comic
    </option>

    <option value="Clay Animation">
      Clay Animation
    </option>
  </select>
</div>

          <button
            onClick={handleGenerateStoryboard}
            disabled={!story.trim()}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Generate Storyboard
          </button>
        </div>

        {/* Character Profiles */}
        {characters.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">
              Character Profiles
            </h2>

            <div className="grid gap-4">
              {characters.map((character) => (
                <div
                  key={character.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h3 className="text-xl font-bold mb-3">
                    {character.name}
                  </h3>

                  <div className="space-y-2 text-gray-700">
  <p>
    <strong>Type:</strong>{" "}
    {character.type}
  </p>

  <p>
    <strong>Appearance:</strong>{" "}
    {character.appearance}
  </p>

  <p>
    <strong>Eyes:</strong>{" "}
    {character.eyes}
  </p>

  <p>
    <strong>Clothing:</strong>{" "}
    {character.clothing}
  </p>

  <p>
    <strong>Personality:</strong>{" "}
    {character.personality}
  </p>

  <p>
    <strong>Role:</strong>{" "}
    {character.role}
  </p>

  <p>
    <strong>Visual Style:</strong>{" "}
    {character.visualStyle}
  </p>
  <p>
  <strong>Reference Description:</strong>{" "}
  {character.referenceDescription}
</p>
</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Storyboard */}
        {scenes.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Storyboard
            </h2>

            {scenes.map((scene) => (
              <div
                key={scene.id}
                className="bg-white rounded-xl shadow-md overflow-hidden mb-6"
              >
                {/* Future Image */}
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">
                    Future AI Image
                  </span>
                </div>

                {/* Scene Information */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">
                    {scene.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
  Animation Style: {scene.animationStyle}
</p>

                  <div className="mb-4">
                    <strong>Description:</strong>

                    <p className="text-gray-700 mt-1">
                      {scene.description}
                    </p>
                  </div>

                  <div className="mb-4">
  <strong>Characters:</strong>

  {scene.characters.length > 0 ? (
    <ul className="list-disc list-inside mt-1 text-gray-700">
      {scene.characters.map((character) => (
        <li key={character}>
          {character}
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500 mt-1">
      No characters detected
    </p>
  )}
</div>

<div className="mb-4">
  <strong>Location:</strong>

  <p className="text-gray-700 mt-1">
    {scene.location}
  </p>
</div>

<div className="mb-4">
  <strong>Objects:</strong>

  {scene.objects.length > 0 ? (
    <ul className="list-disc list-inside mt-1 text-gray-700">
      {scene.objects.map((object) => (
        <li key={object}>
          {object}
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500 mt-1">
      No important objects detected
    </p>
  )}
</div>

<div className="mb-4">
  <strong>Action:</strong>

  <p className="text-gray-700 mt-1">
    {scene.action}
  </p>
</div>

<div className="mb-4">
  <strong>Camera:</strong>

  <p className="text-gray-700 mt-1">
    {scene.camera}
  </p>
</div>

                  <div className="mb-4">
                    <strong>Image Prompt:</strong>

                    <p className="text-sm text-gray-600 mt-1">
                      {scene.imagePrompt}
                    </p>
                  </div>

                  <div>
                    <strong>Animation Prompt:</strong>

                    <p className="text-sm text-gray-600 mt-1">
                      {scene.animationPrompt}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}