import { apiRequest } from "../utils/request";
import type {
  Pipeline,
  PipelineInput,
  PipelineStage,
  PipelineStageInput,
} from "../types/pipeline.types";

const BASE_URL = "https://api.warmr.app/v1";

export class PipelinesService {
  // --- Pipelines ---

  static async listPipelines(apiKey: string): Promise<Pipeline[]> {
    return apiRequest<Pipeline[]>(`${BASE_URL}/pipelines`, {}, apiKey);
  }

  static async createPipeline(
    data: PipelineInput,
    apiKey: string,
  ): Promise<Pipeline> {
    return apiRequest<Pipeline>(
      `${BASE_URL}/pipelines`,
      { method: "POST", body: JSON.stringify(data) },
      apiKey,
    );
  }

  static async updatePipeline(
    uuid: string,
    data: Partial<PipelineInput>,
    apiKey: string,
  ): Promise<Pipeline> {
    return apiRequest<Pipeline>(
      `${BASE_URL}/pipelines/${uuid}`,
      { method: "PATCH", body: JSON.stringify(data) },
      apiKey,
    );
  }

  static async deletePipeline(uuid: string, apiKey: string): Promise<void> {
    await apiRequest(
      `${BASE_URL}/pipelines/${uuid}`,
      { method: "DELETE" },
      apiKey,
    );
  }

  // --- Stages ---

  static async listStages(
    pipelineUuid: string,
    apiKey: string,
  ): Promise<PipelineStage[]> {
    return apiRequest<PipelineStage[]>(
      `${BASE_URL}/pipelines/${pipelineUuid}/stages`,
      {},
      apiKey,
    );
  }

  static async createStage(
    pipelineUuid: string,
    data: PipelineStageInput,
    apiKey: string,
  ): Promise<PipelineStage> {
    return apiRequest<PipelineStage>(
      `${BASE_URL}/pipelines/${pipelineUuid}/stages`,
      { method: "POST", body: JSON.stringify(data) },
      apiKey,
    );
  }

  static async updateStage(
    stageUuid: string,
    data: Partial<PipelineStageInput>,
    apiKey: string,
  ): Promise<PipelineStage> {
    return apiRequest<PipelineStage>(
      `${BASE_URL}/pipelines/stages/${stageUuid}`,
      { method: "PATCH", body: JSON.stringify(data) },
      apiKey,
    );
  }

  static async deleteStage(
    stageUuid: string,
    apiKey: string,
  ): Promise<void> {
    await apiRequest(
      `${BASE_URL}/pipelines/stages/${stageUuid}`,
      { method: "DELETE" },
      apiKey,
    );
  }

  // --- Stage contacts ---

  static async addContactsToStage(
    stageUuid: string,
    contactUuids: string[],
    apiKey: string,
  ): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>(
      `${BASE_URL}/pipelines/stages/${stageUuid}/contacts`,
      { method: "POST", body: JSON.stringify({ contactUuids }) },
      apiKey,
    );
  }

  static async removeContactFromStage(
    stageUuid: string,
    contactUuid: string,
    apiKey: string,
  ): Promise<void> {
    await apiRequest(
      `${BASE_URL}/pipelines/stages/${stageUuid}/contacts/${contactUuid}`,
      { method: "DELETE" },
      apiKey,
    );
  }
}
