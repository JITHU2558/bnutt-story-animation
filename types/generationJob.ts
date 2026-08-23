export type GenerationType =
  | "image"
  | "animation"
  | "video";

export type GenerationStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export interface GenerationJob {
  id: string;
  projectId: string;
  sceneId: number;
  type: GenerationType;
  status: GenerationStatus;
  prompt: string;
  resultUrl: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}