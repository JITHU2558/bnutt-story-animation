import { NextRequest } from "next/server";
import { generateSceneVideo } from "@/lib/videoGenerator";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const imageUrl =
      body?.imageUrl;

    const animationPrompt =
      body?.animationPrompt;

    if (
      typeof imageUrl !==
        "string" ||
      !imageUrl.trim()
    ) {
      return Response.json(
        {
          error:
            "A scene image is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof animationPrompt !==
        "string" ||
      !animationPrompt.trim()
    ) {
      return Response.json(
        {
          error:
            "An animation prompt is required.",
        },
        {
          status: 400,
        }
      );
    }

    let imageBlob: Blob;

    if (
      imageUrl.startsWith(
        "data:"
      )
    ) {
      const commaIndex =
        imageUrl.indexOf(",");

      if (
        commaIndex === -1
      ) {
        throw new Error(
          "Invalid image data."
        );
      }

      const metadata =
        imageUrl.slice(
          0,
          commaIndex
        );

      const base64 =
        imageUrl.slice(
          commaIndex + 1
        );

      const mimeMatch =
        metadata.match(
          /data:(.*?);base64/
        );

      const mimeType =
        mimeMatch?.[1] ||
        "image/png";

      const buffer =
        Buffer.from(
          base64,
          "base64"
        );

      imageBlob =
        new Blob(
          [
            buffer,
          ],
          {
            type:
              mimeType,
          }
        );
    } else {
      const imageResponse =
        await fetch(
          imageUrl
        );

      if (
        !imageResponse.ok
      ) {
        throw new Error(
          "Unable to download the scene image."
        );
      }

      imageBlob =
        await imageResponse.blob();
    }

    if (
      imageBlob.size === 0
    ) {
      throw new Error(
        "The scene image is empty."
      );
    }

    const video =
      await generateSceneVideo(
        imageBlob,
        animationPrompt
      );

    if (
      !video ||
      video.size === 0
    ) {
      throw new Error(
        "The video generator returned an empty video."
      );
    }

    return new Response(
      video,
      {
        status: 200,

        headers: {
          "Content-Type":
            "video/mp4",

          "Content-Length":
            video.size.toString(),

          "Cache-Control":
            "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Video generation error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Video generation failed.";

    return Response.json(
      {
        error: message,
      },
      {
        status: 500,
      }
    );
  }
}