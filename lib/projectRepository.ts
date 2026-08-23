import { supabase } from "@/lib/supabase/client";
import { Character } from "@/types/character";
import { Scene } from "@/types/story";

export interface CreateProjectInput {
  name: string;
  story: string;
  animationStyle: string;
}

export async function createProject(
  input: CreateProjectInput
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(
      `Unable to get current user: ${userError.message}`
    );
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
    throw new Error(
      `Failed to create project: ${error.message}`
    );
  }

  return data;
}

export async function saveCharacters(
  projectId: string,
  characters: Character[]
) {
  if (characters.length === 0) {
    return [];
  }

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

  const { data, error } = await supabase
    .from("characters")
    .insert(rows)
    .select();

  if (error) {
    throw new Error(
      `Failed to save characters: ${error.message}`
    );
  }

  return data;
}

export async function saveScenes(
  projectId: string,
  scenes: Scene[]
) {
  if (scenes.length === 0) {
    return [];
  }

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

  const { data, error } = await supabase
    .from("scenes")
    .insert(rows)
    .select();

  if (error) {
    throw new Error(
      `Failed to save scenes: ${error.message}`
    );
  }

  return data;
}

export async function saveStoryboardProject(
  input: CreateProjectInput,
  characters: Character[],
  scenes: Scene[]
) {
  const project = await createProject(input);

  try {
    await saveCharacters(
      project.id,
      characters
    );

    await saveScenes(
      project.id,
      scenes
    );

    return project;
  } catch (error) {
    await supabase
      .from("projects")
      .delete()
      .eq("id", project.id);

    throw error;
  }
}

export async function getProjects() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(
      `Unable to get current user: ${userError.message}`
    );
  }

  if (!user) {
    throw new Error(
      "You must be signed in to view projects."
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
    throw new Error(
      `Failed to load projects: ${error.message}`
    );
  }

  return data;
}