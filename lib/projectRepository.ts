import { supabase } from "@/lib/supabase/client";

export interface CreateProjectInput {
  name: string;
  story: string;
  animationStyle: string;
}

export async function createProject(
  input: CreateProjectInput
) {
  const {
    data: userData,
  } = await supabase.auth.getUser();

  const user = userData.user;

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
      animation_style:
        input.animationStyle,
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

export async function getProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
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