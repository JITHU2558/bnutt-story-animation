import { supabase } from "@/lib/supabase/client";

export async function uploadSceneImage(
  projectId: string,
  sceneId: number,
  image: Blob
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
      "You must be signed in to upload images."
    );
  }

  const filePath =
    `${user.id}/${projectId}/scene-${sceneId}.png`;

  const { error: uploadError } =
    await supabase.storage
      .from("bnutt-assets")
      .upload(filePath, image, {
        contentType:
          image.type || "image/png",
        upsert: true,
      });

  if (uploadError) {
    throw new Error(
      `Failed to upload image: ${uploadError.message}`
    );
  }

  return filePath;
}

export async function getSceneImageUrl(
  imagePath: string
): Promise<string> {
  if (!imagePath.trim()) {
    throw new Error(
      "Image path cannot be empty."
    );
  }

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

  const { data, error } =
    await supabase.storage
      .from("bnutt-assets")
      .createSignedUrl(
        imagePath,
        60 * 60
      );

  if (error) {
    throw new Error(
      `Failed to create image URL: ${error.message}`
    );
  }

  if (!data?.signedUrl) {
    throw new Error(
      "Supabase did not return an image URL."
    );
  }

  return data.signedUrl;
}

export async function updateSceneImage(
  projectId: string,
  sceneNumber: number,
  imagePath: string
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
      "You must be signed in."
    );
  }

  const { data, error } =
    await supabase
      .from("scenes")
      .update({
        image_url: imagePath,
        updated_at:
          new Date().toISOString(),
      })
      .eq("project_id", projectId)
      .eq("scene_number", sceneNumber)
      .select()
      .single();

  if (error) {
    throw new Error(
      `Failed to save scene image: ${error.message}`
    );
  }

  return data;
}

export async function uploadSceneVideo(
  projectId: string,
  sceneNumber: number,
  video: Blob
): Promise<string> {
  if (!video || video.size === 0) {
    throw new Error(
      "Video cannot be empty."
    );
  }

  const {
    data: { user },
    error: userError,
  } =
    await supabase.auth.getUser();

  if (userError) {
    throw new Error(
      userError.message
    );
  }

  if (!user) {
    throw new Error(
      "You must be signed in."
    );
  }

  const filePath =
    `${user.id}/${projectId}/scene-${sceneNumber}.mp4`;

  const {
    error,
  } = await supabase.storage
    .from("bnutt-assets")
    .upload(
      filePath,
      video,
      {
        contentType:
          "video/mp4",
        upsert: true,
      }
    );

  if (error) {
    throw new Error(
      `Failed to upload scene video: ${error.message}`
    );
  }

  return filePath;
}

export async function getSceneVideoUrl(
  videoPath: string
): Promise<string> {
  if (!videoPath.trim()) {
    throw new Error(
      "Video path cannot be empty."
    );
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(
      userError.message
    );
  }

  if (!user) {
    throw new Error(
      "You must be signed in."
    );
  }

  const {
    data,
    error,
  } = await supabase.storage
    .from("bnutt-assets")
    .createSignedUrl(
      videoPath,
      60 * 60
    );

  if (error) {
    throw new Error(
      `Failed to create video URL: ${error.message}`
    );
  }

  if (!data?.signedUrl) {
    throw new Error(
      "Supabase did not return a video URL."
    );
  }

  return data.signedUrl;
}