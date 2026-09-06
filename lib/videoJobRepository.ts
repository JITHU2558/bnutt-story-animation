import { supabase } from "@/lib/supabase/client";

export type VideoJobStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed";

export interface VideoJob {
  id: string;
  projectId: string;
  sceneNumber: number;
  status: VideoJobStatus;
  imagePath: string;
  animationPrompt: string;
  videoPath: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

function mapVideoJob(row: any): VideoJob {
  return {
    id: row.id,
    projectId: row.project_id,
    sceneNumber: row.scene_number,
    status: row.status,
    imagePath: row.image_path,
    animationPrompt: row.animation_prompt,
    videoPath: row.video_path ?? null,
    errorMessage: row.error_message ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createVideoJob(
  projectId: string,
  sceneNumber: number,
  imagePath: string,
  animationPrompt: string
): Promise<VideoJob> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error(
      "You must be signed in to create a video job."
    );
  }

  if (!projectId.trim()) {
    throw new Error(
      "Project ID is required."
    );
  }

  if (!imagePath.trim()) {
    throw new Error(
      "Scene image is required."
    );
  }

  if (!animationPrompt.trim()) {
    throw new Error(
      "Animation prompt is required."
    );
  }

  const { data, error } = await supabase
    .from("video_jobs")
    .upsert(
      {
        project_id: projectId,
        scene_number: sceneNumber,
        status: "queued",
        image_path: imagePath,
        animation_prompt: animationPrompt,
        video_path: null,
        error_message: null,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict:
          "project_id,scene_number",
      }
    )
    .select()
    .single();

  if (error) {
    throw new Error(
      `Failed to create video job: ${error.message}`
    );
  }

  return mapVideoJob(data);
}

export async function getVideoJob(
  jobId: string
): Promise<VideoJob | null> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error(
      "You must be signed in."
    );
  }

  const { data, error } = await supabase
    .from("video_jobs")
    .select("*")
    .eq("id", jobId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed to load video job: ${error.message}`
    );
  }

  if (!data) {
    return null;
  }

  return mapVideoJob(data);
}

export async function getProjectVideoJobs(
  projectId: string
): Promise<VideoJob[]> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error(
      "You must be signed in."
    );
  }

  const { data, error } = await supabase
    .from("video_jobs")
    .select("*")
    .eq("project_id", projectId)
    .order("scene_number", {
      ascending: true,
    });

  if (error) {
    throw new Error(
      `Failed to load video jobs: ${error.message}`
    );
  }

  return (data ?? []).map(mapVideoJob);
}