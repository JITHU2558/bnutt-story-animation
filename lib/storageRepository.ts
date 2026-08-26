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

  const { data, error } = await supabase
    .from("scenes")
    .update({
      image_url: imagePath,
      updated_at: new Date().toISOString(),
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