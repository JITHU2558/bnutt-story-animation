import { supabase } from "@/lib/supabase/client";
import { Character } from "@/types/character";
import { Scene } from "@/types/story";
import { AnimationStyle } from "@/types/animationStyle";
import { analyzeSceneContinuity } from "@/lib/continuityAnalyzer";

export interface CreateProjectInput {
  name: string;
  story: string;
  animationStyle: AnimationStyle;
}

export interface SavedProject {
  id: string;
  name: string;
  story: string;
  animationStyle: AnimationStyle;
  createdAt: string;
}

export interface LoadedProject {
  id: string;
  name: string;
  story: string;
  animationStyle: AnimationStyle;
  characters: Character[];
  scenes: Scene[];
}

export async function createProject(
  input: CreateProjectInput
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error(
      "You must be signed in to create a project."
    );
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      name: input.name,
      story: input.story,
      animation_style: input.animationStyle,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function saveCharacters(
  projectId: string,
  characters: Character[]
) {
  if (characters.length === 0) return;

  const rows = characters.map((character) => ({
    project_id: projectId,
    name: character.name,
    type: character.type,
    appearance: character.appearance,
    eyes: character.eyes,
    clothing: character.clothing,
    personality: character.personality,
    role: character.role,
    visual_style: character.visualStyle,
    reference_description:
      character.referenceDescription,
  }));

  const { error } = await supabase
    .from("characters")
    .insert(rows);

  if (error) {
    throw new Error(error.message);
  }
}

export async function saveScenes(
  projectId: string,
  scenes: Scene[]
) {
  if (scenes.length === 0) return;

  const rows = scenes.map((scene) => ({
    project_id: projectId,
    scene_number: scene.id,
    title: scene.title,
    description: scene.description,
    characters: scene.characters,
    location: scene.location,
    objects: scene.objects,
    action: scene.action,
    camera: scene.camera,
    animation_style: scene.animationStyle,
    image_prompt: scene.imagePrompt,
    animation_prompt: scene.animationPrompt,
  }));

  const { error } = await supabase
    .from("scenes")
    .insert(rows);

  if (error) {
    throw new Error(error.message);
  }
}

export async function saveStoryboardProject(
  input: CreateProjectInput,
  characters: Character[],
  scenes: Scene[]
) {
  const project = await createProject(input);

  try {
    await saveCharacters(project.id, characters);
    await saveScenes(project.id, scenes);

    return project;
  } catch (error) {
    await supabase
      .from("projects")
      .delete()
      .eq("id", project.id);

    throw error;
  }
}

export async function getProjects(): Promise<SavedProject[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "You must be signed in."
    );
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return data.map((project) => ({
    id: project.id,
    name: project.name,
    story: project.story,
    animationStyle:
      project.animation_style as AnimationStyle,
    createdAt: project.created_at,
  }));
}

export async function loadProject(
  projectId: string
): Promise<LoadedProject> {
  const { data: project, error: projectError } =
    await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

  if (projectError || !project) {
    throw new Error(
      projectError?.message ||
        "Project not found."
    );
  }

  const { data: characterRows, error: characterError } =
    await supabase
      .from("characters")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", {
        ascending: true,
      });

  if (characterError) {
    throw new Error(characterError.message);
  }

  const { data: sceneRows, error: sceneError } =
    await supabase
      .from("scenes")
      .select("*")
      .eq("project_id", projectId)
      .order("scene_number", {
        ascending: true,
      });

  if (sceneError) {
    throw new Error(sceneError.message);
  }

  const loadedCharacters: Character[] =
    (characterRows ?? []).map(
      (character, index) => ({
        id: index + 1,
        name: character.name,
        type: character.type,
        appearance: character.appearance ?? "",
        eyes: character.eyes ?? "",
        clothing: character.clothing ?? "",
        personality: character.personality ?? "",
        role: character.role ?? "",
        visualStyle:
          character.visual_style as AnimationStyle,
        referenceDescription:
          character.reference_description ?? "",
      })
    );

  const rawScenes: Scene[] =
    (sceneRows ?? []).map((scene) => ({
      id: scene.scene_number,
      title: scene.title ?? "",
      description: scene.description ?? "",
      characters: scene.characters ?? [],
      location: scene.location ?? "",
      objects: scene.objects ?? [],
      action: scene.action ?? "",
      camera: scene.camera ?? "",
      imagePrompt: scene.image_prompt ?? "",
      animationPrompt:
        scene.animation_prompt ?? "",
      animationStyle:
        scene.animation_style as AnimationStyle,
      continuity: {
        previousSceneId: null,
        nextSceneId: null,
        continuingCharacters: [],
        continuingObjects: [],
        previousLocation: null,
      },
    }));

  const scenes =
    analyzeSceneContinuity(rawScenes);

  return {
    id: project.id,
    name: project.name,
    story: project.story,
    animationStyle:
      project.animation_style as AnimationStyle,
    characters: loadedCharacters,
    scenes,
  };
}