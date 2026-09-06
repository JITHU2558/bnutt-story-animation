import Replicate from "replicate";

const VIDEO_MODEL =
  "prunaai/p-video";

export async function generateSceneVideo(
  image: Blob,
  animationPrompt: string
): Promise<Blob> {
  const token =
    process.env.REPLICATE_API_TOKEN;

  if (!token) {
    throw new Error(
      "Missing REPLICATE_API_TOKEN environment variable."
    );
  }

  if (!image || image.size === 0) {
    throw new Error(
      "Scene image is required for video generation."
    );
  }

  if (!animationPrompt.trim()) {
    throw new Error(
      "Animation prompt is required."
    );
  }

  const replicate =
    new Replicate({
      auth: token,
    });

  /*
   * Replicate accepts Blob/File inputs
   * through its client library.
   *
   * We convert the Blob to a File so the
   * SDK can upload it automatically.
   */
  const imageFile =
    new File(
      [image],
      "scene.png",
      {
        type:
          image.type ||
          "image/png",
      }
    );

  const output =
    await replicate.run(
      VIDEO_MODEL,
      {
        input: {
          image: imageFile,

          prompt:
            animationPrompt,

          prompt_upsampling:
            false,
        },
      }
    );

  /*
   * P-Video returns a file-like output
   * containing the generated MP4.
   */
  if (
    output &&
    typeof output ===
      "object" &&
    "arrayBuffer" in output
  ) {
    const buffer =
      await (
        output as {
          arrayBuffer: () => Promise<ArrayBuffer>;
        }
      ).arrayBuffer();

    return new Blob(
      [buffer],
      {
        type:
          "video/mp4",
      }
    );
  }

  /*
   * Some Replicate models return a URL
   * instead of a FileOutput object.
   */
  if (
    typeof output ===
    "string"
  ) {
    const response =
      await fetch(output);

    if (!response.ok) {
      throw new Error(
        "Failed to download generated video."
      );
    }

    return await response.blob();
  }

  /*
   * Handle URL-like output objects.
   */
  if (
    output &&
    typeof output ===
      "object" &&
    "url" in output
  ) {
    const urlValue =
      (
        output as {
          url:
            | string
            | (() => string);
        }
      ).url;

    const videoUrl =
      typeof urlValue ===
      "function"
        ? urlValue()
        : urlValue;

    const response =
      await fetch(
        videoUrl
      );

    if (!response.ok) {
      throw new Error(
        "Failed to download generated video."
      );
    }

    return await response.blob();
  }

  throw new Error(
    "Replicate returned an unsupported video output."
  );
}