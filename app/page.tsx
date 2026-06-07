"use client";

import { useState } from "react";

export default function Home() {
  const [story, setStory] = useState("");
  const [scenes, setScenes] = useState<string[]>([]);

  function generateStoryboard() {
    const generatedScenes = story
      .split(".")
      .filter((scene) => scene.trim() !== "");

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
            onClick={generateStoryboard}
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

            {scenes.map((scene, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-4 mb-4"
              >
                <h3 className="font-bold mb-2">
                  Scene {index + 1}
                </h3>

                <p>{scene}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}