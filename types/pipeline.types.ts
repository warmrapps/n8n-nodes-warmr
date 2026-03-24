export interface Pipeline {
  [key: string]: any;
  uuid: string;
  name: string;
  visibility: "private" | "team";
  icon: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PipelineInput {
  name: string;
  visibility?: "private" | "team";
  icon?: string | null;
}

export interface PipelineStage {
  [key: string]: any;
  uuid: string;
  name: string;
  icon: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface PipelineStageInput {
  name: string;
  icon?: string | null;
  order?: number;
}
