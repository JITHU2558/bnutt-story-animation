export interface SceneContinuity {
  previousSceneId: number | null;
  nextSceneId: number | null;
  continuingCharacters: string[];
  continuingObjects: string[];
  previousLocation: string | null;
}