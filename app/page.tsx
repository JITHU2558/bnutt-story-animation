"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { generateStoryboard } from "@/lib/storyboardGenerator";
import { detectCharacters } from "@/lib/characterDetector";
import { generateCharacterProfiles } from "@/lib/characterProfileGenerator";

import {
  getProjects,
  loadProject,
  saveStoryboardProject,
  updateSceneImage,
  deleteProject,
  SavedProject,
} from "@/lib/projectRepository";

import { uploadSceneImage } from "@/lib/storageRepository";

import { Scene } from "@/types/story";
import { Character } from "@/types/character";
import { AnimationStyle } from "@/types/animationStyle";

export default function Home() {
  const [projectName, setProjectName] =
    useState("Untitled Story");

  const [story, setStory] =
    useState("");

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

  const [currentProjectId, setCurrentProjectId] =
    useState<string | null>(null);

  const [saving, setSaving] =
    useState(false);

  const [loadingProjects, setLoadingProjects] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [generatingImages, setGeneratingImages] =
    useState<Record<number, boolean>>({});

  const [imageErrors, setImageErrors] =
    useState<Record<number, string>>({});

  const [generatedImages, setGeneratedImages] =
    useState<Record<number, string>>({});

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
    if (!story.trim()) {
      return;
    }

    setMessage("");

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

    setCharacters(
      characterProfiles
    );

    setScenes(
      generatedScenes
    );

    setGeneratedImages({});
    setImageErrors({});

    setCurrentProjectId(null);

    setMessage(
      "Storyboard generated successfully. Save the project before generating permanent images."
    );
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
      const project =
        await saveStoryboardProject(
          {
            name:
              projectName.trim() ||
              "Untitled Story",

            story,

            animationStyle,
          },

          characters,

          scenes
        );

      setCurrentProjectId(
        project.id
      );

      setMessage(
        "Project saved successfully. You can now generate AI images."
      );

      await loadProjects();
    } catch (error) {
      if (error instanceof Error) {
        setMessage(
          error.message
        );
      } else {
        setMessage(
          "Failed to save project."
        );
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
        await loadProject(
          projectId
        );

      setCurrentProjectId(
        project.id
      );

      setProjectName(
        project.name
      );

      setStory(
        project.story
      );

      setAnimationStyle(
        project.animationStyle
      );

      setCharacters(
        project.characters
      );

      setScenes(
        project.scenes
      );

      /*
       * Loaded scenes may already contain
       * signed Supabase image URLs.
       */
      const loadedImages: Record<
        number,
        string
      > = {};

      project.scenes.forEach(
        (scene) => {
          if (
            scene.imageUrl
          ) {
            loadedImages[
              scene.id
            ] = scene.imageUrl;
          }
        }
      );

      setGeneratedImages(
        loadedImages
      );

      setImageErrors({});

      setMessage(
        `"${project.name}" loaded successfully.`
      );
    } catch (error) {
      if (error instanceof Error) {
        setMessage(
          error.message
        );
      } else {
        setMessage(
          "Failed to load project."
        );
      }
    }
  }

  async function handleDeleteProject(
    projectId: string,
    projectName: string
  ) {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${projectName}"? This will permanently delete the project and its generated images.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setMessage(
        `Deleting "${projectName}"...`
      );

      await deleteProject(
        projectId
      );

      /*
       * If the deleted project is
       * currently open, clear the UI.
       */
      if (
        currentProjectId ===
        projectId
      ) {
        handleNewProject();
      }

      await loadProjects();

      setMessage(
        `"${projectName}" deleted successfully.`
      );
    } catch (error) {
      if (error instanceof Error) {
        setMessage(
          error.message
        );
      } else {
        setMessage(
          "Failed to delete project."
        );
      }
    }
  }

  function handleNewProject() {
    /*
     * Revoke temporary browser URLs
     * before clearing them.
     */
    Object.values(
      generatedImages
    ).forEach((url) => {
      if (
        url.startsWith(
          "blob:"
        )
      ) {
        URL.revokeObjectURL(
          url
        );
      }
    });

    setProjectName(
      "Untitled Story"
    );

    setStory("");

    setScenes([]);

    setCharacters([]);

    setAnimationStyle(
      "3D Animated Film"
    );

    setCurrentProjectId(
      null
    );

    setGeneratedImages({});

    setImageErrors({});

    setGeneratingImages({});

    setMessage("");
  }

  async function handleGenerateImage(
    scene: Scene
  ) {
    if (!currentProjectId) {
      setImageErrors(
        (current) => ({
          ...current,
          [scene.id]:
            "Please save the project before generating an image.",
        })
      );

      return;
    }

    setGeneratingImages(
      (current) => ({
        ...current,
        [scene.id]: true,
      })
    );

    setImageErrors(
      (current) => {
        const updated = {
          ...current,
        };

        delete updated[
          scene.id
        ];

        return updated;
      }
    );

    try {
      const response =
        await fetch(
          "/api/generate-image",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              prompt:
                scene.imagePrompt,
            }),
          }
        );

      if (!response.ok) {
        let errorMessage =
          "Image generation failed.";

        try {
          const data =
            await response.json();

          if (data?.error) {
            errorMessage =
              data.error;
          }
        } catch {
          // Keep default error.
        }

        throw new Error(
          errorMessage
        );
      }

      const blob =
        await response.blob();

      if (
        blob.size === 0
      ) {
        throw new Error(
          "The image generator returned an empty image."
        );
      }

      /*
       * Upload image to Supabase Storage.
       */
      const imagePath =
        await uploadSceneImage(
          currentProjectId,
          scene.id,
          blob
        );

      /*
       * Save Storage path in database.
       */
      await updateSceneImage(
        currentProjectId,
        scene.id,
        imagePath
      );

      /*
       * Display immediately.
       */
      const imageUrl =
        URL.createObjectURL(
          blob
        );

      /*
       * Revoke the previous temporary
       * URL if one exists.
       */
      const previousUrl =
        generatedImages[
          scene.id
        ];

      if (
        previousUrl?.startsWith(
          "blob:"
        )
      ) {
        URL.revokeObjectURL(
          previousUrl
        );
      }

      setGeneratedImages(
        (current) => ({
          ...current,
          [scene.id]:
            imageUrl,
        })
      );

      /*
       * Update local scene state with
       * the Storage path.
       */
      setScenes(
        (currentScenes) =>
          currentScenes.map(
            (currentScene) =>
              currentScene.id ===
              scene.id
                ? {
                    ...currentScene,
                    imageUrl:
                      imagePath,
                  }
                : currentScene
          )
      );

      setMessage(
        `Scene ${scene.id} image generated and saved successfully.`
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Image generation failed.";

      setImageErrors(
        (current) => ({
          ...current,
          [scene.id]:
            errorMessage,
        })
      );
    } finally {
      setGeneratingImages(
        (current) => ({
          ...current,
          [scene.id]: false,
        })
      );
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <div className="mx-auto max-w-6xl">

        {/* Header */}

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>
            <h1 className="text-4xl font-bold">
              BNutt StoryAnimation
            </h1>

            <p className="text-gray-600">
              Turn stories into animated images
              and videos.
            </p>
          </div>

          <div className="flex gap-3">

            <Link
              href="/auth"
              className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-800 hover:bg-gray-50"
            >
              Sign In
            </Link>

            <button
              onClick={
                handleNewProject
              }
              className="rounded-lg bg-gray-800 px-5 py-3 text-white hover:bg-black"
            >
              New Project
            </button>

          </div>

        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">

          {/* Main Content */}

          <div>

            {/* Story Editor */}

            <div className="mb-8 rounded-xl bg-white p-6 shadow-md">

              <label className="mb-2 block font-semibold">
                Project Name
              </label>

              <input
                value={
                  projectName
                }
                onChange={(
                  event
                ) =>
                  setProjectName(
                    event.target
                      .value
                  )
                }
                className="mb-5 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="My Story"
              />

              <label className="mb-2 block font-semibold">
                Write Your Story
              </label>

              <textarea
                value={story}
                onChange={(
                  event
                ) =>
                  setStory(
                    event.target
                      .value
                  )
                }
                placeholder="Write your story here..."
                className="mb-5 h-48 w-full resize-none rounded-lg border border-gray-300 p-4 focus:outline-none focus:ring-2 focus:ring-black"
              />

              <label className="mb-2 block font-semibold">
                Animation Style
              </label>

              <select
                value={
                  animationStyle
                }
                onChange={(
                  event
                ) =>
                  setAnimationStyle(
                    event.target
                      .value as AnimationStyle
                  )
                }
                className="mb-5 w-full rounded-lg border border-gray-300 bg-white p-3"
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
                  onClick={
                    handleGenerateStoryboard
                  }
                  disabled={
                    !story.trim()
                  }
                  className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  Generate Storyboard
                </button>

                <button
                  onClick={
                    handleSaveProject
                  }
                  disabled={
                    saving ||
                    !story.trim() ||
                    scenes.length ===
                      0
                  }
                  className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {saving
                    ? "Saving..."
                    : "Save Project"}
                </button>

              </div>

              {currentProjectId && (
                <p className="mt-3 text-xs text-gray-500">
                  Project saved and
                  ready for AI image
                  generation.
                </p>
              )}

              {message && (
                <p className="mt-4 rounded-lg bg-gray-100 p-3 text-sm text-gray-700">
                  {message}
                </p>
              )}

            </div>

            {/* Character Profiles */}

            {characters.length >
              0 && (
              <div className="mb-8 rounded-xl bg-white p-6 shadow-md">

                <h2 className="mb-4 text-2xl font-bold">
                  Character Profiles
                </h2>

                <div className="grid gap-4">

                  {characters.map(
                    (
                      character
                    ) => (
                      <div
                        key={
                          character.id
                        }
                        className="rounded-lg border border-gray-200 p-4"
                      >

                        <h3 className="mb-3 text-xl font-bold">
                          {
                            character.name
                          }
                        </h3>

                        <div className="space-y-2 text-gray-700">

                          <p>
                            <strong>
                              Type:
                            </strong>{" "}
                            {
                              character.type
                            }
                          </p>

                          <p>
                            <strong>
                              Appearance:
                            </strong>{" "}
                            {
                              character.appearance
                            }
                          </p>

                          <p>
                            <strong>
                              Eyes:
                            </strong>{" "}
                            {
                              character.eyes
                            }
                          </p>

                          <p>
                            <strong>
                              Clothing:
                            </strong>{" "}
                            {
                              character.clothing
                            }
                          </p>

                          <p>
                            <strong>
                              Personality:
                            </strong>{" "}
                            {
                              character.personality
                            }
                          </p>

                          <p>
                            <strong>
                              Role:
                            </strong>{" "}
                            {
                              character.role
                            }
                          </p>

                          <p>
                            <strong>
                              Visual Style:
                            </strong>{" "}
                            {
                              character.visualStyle
                            }
                          </p>

                          <p>
                            <strong>
                              Reference Description:
                            </strong>{" "}
                            {
                              character.referenceDescription
                            }
                          </p>

                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

            {/* Storyboard */}

            {scenes.length >
              0 && (
              <div>

                <h2 className="mb-4 text-2xl font-bold">
                  Storyboard
                </h2>

                {scenes.map(
                  (scene) => (
                    <div
                      key={
                        scene.id
                      }
                      className="mb-6 overflow-hidden rounded-xl bg-white shadow-md"
                    >

                      {/* Image */}

                      <div className="relative flex min-h-64 items-center justify-center bg-gray-200">

                        {generatedImages[
                          scene.id
                        ] ? (

                          <img
                            src={
                              generatedImages[
                                scene.id
                              ]
                            }
                            alt={`Generated image for ${scene.title}`}
                            className="h-auto max-h-[600px] w-full object-contain"
                          />

                        ) : (

                          <div className="p-8 text-center">

                            <p className="mb-3 text-gray-500">
                              No AI image
                              generated yet.
                            </p>

                            <button
                              onClick={() =>
                                handleGenerateImage(
                                  scene
                                )
                              }
                              disabled={
                                generatingImages[
                                  scene.id
                                ] ||
                                !currentProjectId
                              }
                              className="rounded-lg bg-purple-600 px-5 py-2.5 font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                            >
                              {generatingImages[
                                scene.id
                              ]
                                ? "Generating Image..."
                                : "Generate Image"}
                            </button>

                            {!currentProjectId && (
                              <p className="mt-2 text-xs text-gray-500">
                                Save the project
                                first.
                              </p>
                            )}

                          </div>

                        )}

                        {generatedImages[
                          scene.id
                        ] && (
                          <div className="absolute bottom-4 right-4">

                            <button
                              onClick={() =>
                                handleGenerateImage(
                                  scene
                                )
                              }
                              disabled={
                                generatingImages[
                                  scene.id
                                ]
                              }
                              className="rounded-lg bg-black/80 px-4 py-2 text-sm font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-500"
                            >
                              {generatingImages[
                                scene.id
                              ]
                                ? "Generating..."
                                : "Regenerate Image"}
                            </button>

                          </div>
                        )}

                      </div>

                      {/* Image Error */}

                      {imageErrors[
                        scene.id
                      ] && (
                        <div className="bg-red-50 p-4 text-sm text-red-700">

                          <strong>
                            Image generation
                            error:
                          </strong>{" "}

                          {
                            imageErrors[
                              scene.id
                            ]
                          }

                        </div>
                      )}

                      {/* Scene Information */}

                      <div className="p-6">

                        <h3 className="mb-2 text-xl font-bold">
                          {
                            scene.title
                          }
                        </h3>

                        <p className="mb-4 text-sm text-gray-500">
                          Animation Style:{" "}
                          {
                            scene.animationStyle
                          }
                        </p>

                        <div className="mb-4">
                          <strong>
                            Description:
                          </strong>

                          <p className="mt-1 text-gray-700">
                            {
                              scene.description
                            }
                          </p>
                        </div>

                        <div className="mb-4">
                          <strong>
                            Characters:
                          </strong>

                          {scene.characters
                            .length >
                          0 ? (
                            <ul className="mt-1 list-inside list-disc text-gray-700">

                              {scene.characters.map(
                                (
                                  character
                                ) => (
                                  <li
                                    key={
                                      character
                                    }
                                  >
                                    {
                                      character
                                    }
                                  </li>
                                )
                              )}

                            </ul>
                          ) : (
                            <p className="mt-1 text-gray-500">
                              No characters
                              detected
                            </p>
                          )}

                        </div>

                        <div className="mb-4">
                          <strong>
                            Location:
                          </strong>

                          <p className="mt-1 text-gray-700">
                            {
                              scene.location
                            }
                          </p>
                        </div>

                        <div className="mb-4">
                          <strong>
                            Objects:
                          </strong>

                          {scene.objects
                            .length >
                          0 ? (
                            <ul className="mt-1 list-inside list-disc text-gray-700">

                              {scene.objects.map(
                                (
                                  object
                                ) => (
                                  <li
                                    key={
                                      object
                                    }
                                  >
                                    {
                                      object
                                    }
                                  </li>
                                )
                              )}

                            </ul>
                          ) : (
                            <p className="mt-1 text-gray-500">
                              No important
                              objects
                              detected
                            </p>
                          )}

                        </div>

                        <div className="mb-4">
                          <strong>
                            Action:
                          </strong>

                          <p className="mt-1 text-gray-700">
                            {
                              scene.action
                            }
                          </p>
                        </div>

                        <div className="mb-4">
                          <strong>
                            Camera:
                          </strong>

                          <p className="mt-1 text-gray-700">
                            {
                              scene.camera
                            }
                          </p>
                        </div>

                        <div className="mb-4">
                          <strong>
                            Continuity:
                          </strong>

                          <div className="mt-2 space-y-1 text-sm text-gray-600">

                            <p>
                              Previous
                              Scene:{" "}
                              {
                                scene
                                  .continuity
                                  .previousSceneId ??
                                "None"
                              }
                            </p>

                            <p>
                              Next
                              Scene:{" "}
                              {
                                scene
                                  .continuity
                                  .nextSceneId ??
                                "None"
                              }
                            </p>

                            <p>
                              Previous
                              Location:{" "}
                              {
                                scene
                                  .continuity
                                  .previousLocation ??
                                "None"
                              }
                            </p>

                            <p>
                              Continuing
                              Characters:{" "}
                              {
                                scene
                                  .continuity
                                  .continuingCharacters
                                  .length >
                                0
                                  ? scene.continuity.continuingCharacters.join(
                                      ", "
                                    )
                                  : "None"
                              }
                            </p>

                            <p>
                              Continuing
                              Objects:{" "}
                              {
                                scene
                                  .continuity
                                  .continuingObjects
                                  .length >
                                0
                                  ? scene.continuity.continuingObjects.join(
                                      ", "
                                    )
                                  : "None"
                              }
                            </p>

                          </div>

                        </div>

                        <div className="mb-4">
                          <strong>
                            Image Prompt:
                          </strong>

                          <p className="mt-1 text-sm text-gray-600">
                            {
                              scene.imagePrompt
                            }
                          </p>
                        </div>

                        <div>
                          <strong>
                            Animation Prompt:
                          </strong>

                          <p className="mt-1 text-sm text-gray-600">
                            {
                              scene.animationPrompt
                            }
                          </p>
                        </div>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          </div>

          {/* My Projects */}

          <aside className="h-fit rounded-xl bg-white p-5 shadow-md">

            <div className="mb-4 flex items-center justify-between">

              <h2 className="text-xl font-bold">
                My Projects
              </h2>

              <button
                onClick={
                  loadProjects
                }
                className="text-sm text-gray-500 hover:text-black"
              >
                Refresh
              </button>

            </div>

            {loadingProjects ? (

              <p className="text-sm text-gray-500">
                Loading projects...
              </p>

            ) : projects.length ===
              0 ? (

              <p className="text-sm text-gray-500">
                No saved projects yet.
              </p>

            ) : (

              <div className="space-y-3">

                {projects.map(
                  (project) => (

                    <div
                      key={
                        project.id
                      }
                      className="rounded-lg border border-gray-200 p-3"
                    >

                      <div className="mb-3">

                        <p className="font-semibold">
                          {
                            project.name
                          }
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {new Date(
                            project.createdAt
                          ).toLocaleDateString()}
                        </p>

                      </div>

                      <div className="flex gap-2">

                        <button
                          onClick={() =>
                            handleOpenProject(
                              project.id
                            )
                          }
                          className="flex-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold hover:bg-gray-200"
                        >
                          Open
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteProject(
                              project.id,
                              project.name
                            )
                          }
                          className="rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-200"
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </aside>

        </div>

      </div>

    </main>
  );
}