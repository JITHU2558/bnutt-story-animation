import { InferenceClient } from "@huggingface/inference";

const token = process.env.HF_TOKEN;

if (!token) {
  throw new Error(
    "Missing HF_TOKEN environment variable."
  );
}

const client = new InferenceClient(token);

export async function generateSceneImage(
  prompt: string
): Promise<Blob> {
  if (!prompt.trim()) {
    throw new Error(
      "Image prompt cannot be empty."
    );
  }

  const image = await client.textToImage(
    {
      model:
        "black-forest-labs/FLUX.1-schnell",
      inputs: prompt,
    },
    {
      outputType: "blob",
    }
  );

  return image;
}