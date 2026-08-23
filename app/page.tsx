"use client";

import { useState } from "react";
import { generateStoryboard } from "@/lib/storyboardGenerator";
import { detectCharacters } from "@/lib/characterDetector";
import { generateCharacterProfiles } from "@/lib/characterProfileGenerator";
import { Scene } from "@/types/story";
import { Character } from "@/types/character";
import { AnimationStyle } from "@/types/animationStyle";
import { supabase } from "@/lib/supabase/client";

export default function Home() {
  const [story, setStory] = useState("");
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [animationStyle, setAnimationStyle] =
    useState<AnimationStyle>("3D Animated Film");

  function handleGenerateStoryboard() {
    const detectedCharacters = detectCharacters(story);

    const characterProfiles =
      generateCharacterProfiles(
        detectedCharacters,
        animationStyle
      );

    const generatedScenes = generateStoryboard(
      story,
      animationStyle,
      characterProfiles
    );

    setCharacters(characterProfiles);
    setScenes(generatedScenes);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-5xl font-bold">
            BNutt StoryAnimation
          </h1>

          <p className="text-xl text-gray-600">
            Turn stories into animated images and
            videos.
          </p>
        </div>

        {/* Story Input */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-bold">
            Create Your Story
          </h2>

          <textarea
            value={story}
            onChange={(event) =>
              setStory(event.target.value)
            }
            placeholder="Write your story here..."
            className="mb-4 h-48 w-full resize-none rounded-lg border border-gray-300 p-4 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <div className="mb-4">
            <label
              htmlFor="animationStyle"
              className="mb-2 block font-semibold"
            >
              Animation Style
            </label>

            <select
              id="animationStyle"
              value={animationStyle}
              onChange={(event) =>
                setAnimationStyle(
                  event.target.value as AnimationStyle
                )
              }
              className="w-full rounded-lg border border-gray-300 bg-white p-3"
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
            className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            Generate Storyboard
          </button>
        </div>

        {/* Character Profiles */}
        {characters.length > 0 && (
          <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-2xl font-bold">
              Character Profiles
            </h2>

            <div className="grid gap-4">
              {characters.map((character) => (
                <div
                  key={character.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <h3 className="mb-3 text-xl font-bold">
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
                      <strong>
                        Reference Description:
                      </strong>{" "}
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
            <h2 className="mb-4 text-2xl font-bold">
              Storyboard
            </h2>

            {scenes.map((scene) => (
              <div
                key={scene.id}
                className="mb-6 overflow-hidden rounded-xl bg-white shadow-md"
              >
                {/* Future Image */}
                <div className="flex h-64 items-center justify-center bg-gray-200">
                  <span className="text-gray-500">
                    Future AI Image
                  </span>
                </div>

                {/* Scene Information */}
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold">
                    {scene.title}
                  </h3>

                  <p className="mb-4 text-sm text-gray-500">
                    Animation Style:{" "}
                    {scene.animationStyle}
                  </p>

                  <div className="mb-4">
                    <strong>Description:</strong>

                    <p className="mt-1 text-gray-700">
                      {scene.description}
                    </p>
                  </div>

                  <div className="mb-4">
                    <strong>Characters:</strong>

                    {scene.characters.length > 0 ? (
                      <ul className="mt-1 list-inside list-disc text-gray-700">
                        {scene.characters.map(
                          (character) => (
                            <li key={character}>
                              {character}
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="mt-1 text-gray-500">
                        No characters detected
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <strong>Location:</strong>

                    <p className="mt-1 text-gray-700">
                      {scene.location}
                    </p>
                  </div>

                  <div className="mb-4">
                    <strong>Objects:</strong>

                    {scene.objects.length > 0 ? (
                      <ul className="mt-1 list-inside list-disc text-gray-700">
                        {scene.objects.map(
                          (object) => (
                            <li key={object}>
                              {object}
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="mt-1 text-gray-500">
                        No important objects detected
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <strong>Action:</strong>

                    <p className="mt-1 text-gray-700">
                      {scene.action}
                    </p>
                  </div>

                  <div className="mb-4">
                    <strong>Camera:</strong>

                    <p className="mt-1 text-gray-700">
                      {scene.camera}
                    </p>
                  </div>

                  {/* Continuity */}
                  <div className="mb-4">
                    <strong>Continuity:</strong>

                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p>
                        Previous Scene:{" "}
                        {scene.continuity
                          .previousSceneId ??
                          "None"}
                      </p>

                      <p>
                        Next Scene:{" "}
                        {scene.continuity.nextSceneId ??
                          "None"}
                      </p>

                      <p>
                        Previous Location:{" "}
                        {scene.continuity
                          .previousLocation ??
                          "None"}
                      </p>

                      <p>
                        Continuing Characters:{" "}
                        {scene.continuity
                          .continuingCharacters
                          .length > 0
                          ? scene.continuity
                              .continuingCharacters
                              .join(", ")
                          : "None"}
                      </p>

                      <p>
                        Continuing Objects:{" "}
                        {scene.continuity
                          .continuingObjects
                          .length > 0
                          ? scene.continuity
                              .continuingObjects
                              .join(", ")
                          : "None"}
                      </p>
                    </div>
                  </div>

                  {/* Image Prompt */}
                  <div className="mb-4">
                    <strong>Image Prompt:</strong>

                    <p className="mt-1 text-sm text-gray-600">
                      {scene.imagePrompt}
                    </p>
                  </div>

                  {/* Animation Prompt */}
                  <div>
                    <strong>
                      Animation Prompt:
                    </strong>

                    <p className="mt-1 text-sm text-gray-600">
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