"use client";

import { useEffect, useState } from "react";
import { generateStoryboard } from "@/lib/storyboardGenerator";
import { detectCharacters } from "@/lib/characterDetector";
import { generateCharacterProfiles } from "@/lib/characterProfileGenerator";
import {
  getProjects,
  loadProject,
  saveStoryboardProject,
  SavedProject,
} from "@/lib/projectRepository";
import { Scene } from "@/types/story";
import { Character } from "@/types/character";
import { AnimationStyle } from "@/types/animationStyle";

export default function Home() {
  const [projectName, setProjectName] =
    useState("Untitled Story");

  const [story, setStory] = useState("");

  const [scenes, setScenes] =
    useState<Scene[]>([]);

  const [characters, setCharacters] =
    useState<Character[]>([]);

  const [animationStyle, setAnimationStyle] =
    useState<AnimationStyle>(
      "3D Animated Film"
    );

  const [projects, setProjects] =
    useState<SavedProject[]>([]);

  const [saving, setSaving] =
    useState(false);

  const [loadingProjects, setLoadingProjects] =
    useState(true);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch {
      setProjects([]);
    } finally {
      setLoadingProjects(false);
    }
  }

  function handleGenerateStoryboard() {
    if (!story.trim()) return;

    const detectedCharacters =
      detectCharacters(story);

    const characterProfiles =
      generateCharacterProfiles(
        detectedCharacters,
        animationStyle
      );

    const generatedScenes =
      generateStoryboard(
        story,
        animationStyle,
        characterProfiles
      );

    setCharacters(characterProfiles);
    setScenes(generatedScenes);
    setMessage("Storyboard generated successfully.");
  }

  async function handleSaveProject() {
    if (!story.trim()) {
      setMessage(
        "Please enter a story first."
      );
      return;
    }

    if (scenes.length === 0) {
      setMessage(
        "Generate the storyboard before saving."
      );
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      await saveStoryboardProject(
        {
          name: projectName,
          story,
          animationStyle,
        },
        characters,
        scenes
      );

      setMessage(
        "Project saved successfully."
      );

      await loadProjects();
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Failed to save project.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleOpenProject(
    projectId: string
  ) {
    try {
      const project =
        await loadProject(projectId);

      setProjectName(project.name);
      setStory(project.story);
      setAnimationStyle(
        project.animationStyle
      );
      setCharacters(project.characters);
      setScenes(project.scenes);

      setMessage(
        `"${project.name}" loaded successfully.`
      );
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Failed to load project.");
      }
    }
  }

  function handleNewProject() {
    setProjectName("Untitled Story");
    setStory("");
    setScenes([]);
    setCharacters([]);
    setAnimationStyle(
      "3D Animated Film"
    );
    setMessage("");
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-4xl font-bold">
              BNutt StoryAnimation
            </h1>

            <p className="text-gray-600">
              Turn stories into animated images and videos.
            </p>
          </div>

          <button
            onClick={handleNewProject}
            className="rounded-lg bg-gray-800 px-5 py-3 text-white hover:bg-black"
          >
            New Project
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">

          <div>

            <div className="mb-8 rounded-xl bg-white p-6 shadow-md">

              <label className="mb-2 block font-semibold">
                Project Name
              </label>

              <input
                value={projectName}
                onChange={(e) =>
                  setProjectName(e.target.value)
                }
                className="mb-5 w-full rounded-lg border border-gray-300 p-3"
              />

              <label className="mb-2 block font-semibold">
                Write Your Story
              </label>

              <textarea
                value={story}
                onChange={(e) =>
                  setStory(e.target.value)
                }
                placeholder="Write your story here..."
                className="mb-5 h-48 w-full resize-none rounded-lg border border-gray-300 p-4"
              />

              <label className="mb-2 block font-semibold">
                Animation Style
              </label>

              <select
                value={animationStyle}
                onChange={(e) =>
                  setAnimationStyle(
                    e.target.value as AnimationStyle
                  )
                }
                className="mb-5 w-full rounded-lg border border-gray-300 p-3"
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

              <div className="flex flex-wrap gap-3">

                <button
                  onClick={handleGenerateStoryboard}
                  disabled={!story.trim()}
                  className="rounded-lg bg-black px-6 py-3 text-white disabled:bg-gray-400"
                >
                  Generate Storyboard
                </button>

                <button
                  onClick={handleSaveProject}
                  disabled={
                    saving ||
                    scenes.length === 0
                  }
                  className="rounded-lg bg-blue-600 px-6 py-3 text-white disabled:bg-gray-400"
                >
                  {saving
                    ? "Saving..."
                    : "Save Project"}
                </button>

              </div>

              {message && (
                <p className="mt-4 rounded-lg bg-gray-100 p-3 text-sm text-gray-700">
                  {message}
                </p>
              )}

            </div>

            {characters.length > 0 && (
              <div className="mb-8 rounded-xl bg-white p-6 shadow-md">

                <h2 className="mb-4 text-2xl font-bold">
                  Character Profiles
                </h2>

                <div className="grid gap-4">

                  {characters.map((character) => (
                    <div
                      key={character.id}
                      className="rounded-lg border p-4"
                    >
                      <h3 className="mb-2 text-xl font-bold">
                        {character.name}
                      </h3>

                      <p><strong>Type:</strong> {character.type}</p>
                      <p><strong>Appearance:</strong> {character.appearance}</p>
                      <p><strong>Eyes:</strong> {character.eyes}</p>
                      <p><strong>Clothing:</strong> {character.clothing}</p>
                      <p><strong>Personality:</strong> {character.personality}</p>
                      <p><strong>Role:</strong> {character.role}</p>
                      <p><strong>Visual Style:</strong> {character.visualStyle}</p>
                    </div>
                  ))}

                </div>
              </div>
            )}

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

                    <div className="flex h-64 items-center justify-center bg-gray-200">
                      <span className="text-gray-500">
                        Future AI Image
                      </span>
                    </div>

                    <div className="p-6">

                      <h3 className="mb-3 text-xl font-bold">
                        {scene.title}
                      </h3>

                      <p className="mb-3 text-sm text-gray-500">
                        Animation Style: {scene.animationStyle}
                      </p>

                      <p className="mb-3">
                        <strong>Description:</strong>{" "}
                        {scene.description}
                      </p>

                      <p className="mb-3">
                        <strong>Location:</strong>{" "}
                        {scene.location}
                      </p>

                      <p className="mb-3">
                        <strong>Action:</strong>{" "}
                        {scene.action}
                      </p>

                      <p className="mb-3">
                        <strong>Camera:</strong>{" "}
                        {scene.camera}
                      </p>

                      <div className="mb-3">
                        <strong>Characters:</strong>

                        {scene.characters.length > 0 ? (
                          <ul className="list-inside list-disc">
                            {scene.characters.map((c) => (
                              <li key={c}>{c}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>No characters detected</p>
                        )}
                      </div>

                      <div className="mb-3">
                        <strong>Objects:</strong>

                        {scene.objects.length > 0 ? (
                          <ul className="list-inside list-disc">
                            {scene.objects.map((o) => (
                              <li key={o}>{o}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>No important objects</p>
                        )}
                      </div>

                      <div className="mb-3">
                        <strong>Image Prompt:</strong>
                        <p className="text-sm text-gray-600">
                          {scene.imagePrompt}
                        </p>
                      </div>

                      <div>
                        <strong>Animation Prompt:</strong>
                        <p className="text-sm text-gray-600">
                          {scene.animationPrompt}
                        </p>
                      </div>

                    </div>
                  </div>
                ))}

              </div>
            )}

          </div>

          <aside className="h-fit rounded-xl bg-white p-5 shadow-md">

            <h2 className="mb-4 text-xl font-bold">
              My Projects
            </h2>

            {loadingProjects ? (
              <p className="text-sm text-gray-500">
                Loading projects...
              </p>
            ) : projects.length === 0 ? (
              <p className="text-sm text-gray-500">
                No saved projects yet.
              </p>
            ) : (
              <div className="space-y-3">

                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() =>
                      handleOpenProject(project.id)
                    }
                    className="w-full rounded-lg border p-3 text-left hover:bg-gray-50"
                  >
                    <p className="font-semibold">
                      {project.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(
                        project.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </button>
                ))}

              </div>
            )}

          </aside>

        </div>
      </div>
    </main>
  );
}