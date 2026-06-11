"use client";

import { useState } from "react";
import { generateStoryboard } from "@/lib/storyboardGenerator";
import { Scene } from "@/types/story";

export default function Home() {
  const [story, setStory] = useState("");
  const [scenes, setScenes] = useState<Scene[]>([]);

  function handleGenerateStoryboard() {
    const generatedScenes = generateStoryboard(story);
    setScenes(generatedScenes);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-4">
          BNutt StoryAnimation
        </h1>

        <p className="text-center text-gray-600 mb-8">
          Turn stories into animated images and videos.
        </p>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Write your story here..."
            className="w-full h-48 border rounded-lg p-4 mb-4"
          />

          <button
            onClick={handleGenerateStoryboard}
            className="bg-black text-white px-6 py-3 rounded-lg"
          >
            Generate Storyboard
          </button>
        </div>

        {scenes.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Storyboard
            </h2>

            {scenes.map((scene) => (
              <div
                key={scene.id}
                className="bg-white rounded-xl shadow-md p-6 mb-4"
              >
                <h3 className="text-xl font-bold mb-3">
                  {scene.title}
                </h3>

                <div className="mb-3">
                  <strong>Description:</strong>
                  <p>{scene.description}</p>
                </div>

                <div className="mb-3">
                  <strong>Image Prompt:</strong>
                  <p>{scene.imagePrompt}</p>
                </div>

                <div>
                  <strong>Animation Prompt:</strong>
                  <p>{scene.animationPrompt}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}