import { apiRequest } from "../utils/request";
import type { Tag, TagInput } from "../types/tag.types";

const BASE_URL = "https://api.warmr.app/v1";

export class TagsService {
  static async listTags(apiKey: string): Promise<Tag[]> {
    return apiRequest<Tag[]>(`${BASE_URL}/tags`, {}, apiKey);
  }

  static async createTag(data: TagInput, apiKey: string): Promise<Tag> {
    return apiRequest<Tag>(
      `${BASE_URL}/tags`,
      { method: "POST", body: JSON.stringify(data) },
      apiKey,
    );
  }

  static async updateTag(
    id: number,
    data: Partial<TagInput>,
    apiKey: string,
  ): Promise<Tag> {
    return apiRequest<Tag>(
      `${BASE_URL}/tags/${id}`,
      { method: "PATCH", body: JSON.stringify(data) },
      apiKey,
    );
  }

  static async deleteTag(id: number, apiKey: string): Promise<void> {
    await apiRequest(`${BASE_URL}/tags/${id}`, { method: "DELETE" }, apiKey);
  }

  static async getContactTags(
    contactUuid: string,
    apiKey: string,
  ): Promise<Tag[]> {
    return apiRequest<Tag[]>(
      `${BASE_URL}/contacts/${contactUuid}/tags`,
      {},
      apiKey,
    );
  }

  static async replaceContactTags(
    contactUuid: string,
    tagIds: number[],
    apiKey: string,
  ): Promise<void> {
    await apiRequest(
      `${BASE_URL}/contacts/${contactUuid}/tags`,
      { method: "POST", body: JSON.stringify({ tagIds }) },
      apiKey,
    );
  }
}
