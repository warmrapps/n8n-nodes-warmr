import { apiRequest } from "../utils/request";
import type { List, ListInput, ListSearchQuery } from "../types/list.types";
import type { PaginatedResponse } from "../types/contact.types";

const BASE_URL = "https://api.warmr.app/v1";

export class ListsService {
  static async getLists(
    query: ListSearchQuery,
    apiKey: string,
  ): Promise<PaginatedResponse<List>> {
    const params = new URLSearchParams();

    if (query.page) params.set("page", String(query.page));
    if (query.per_page) params.set("per_page", String(query.per_page));

    const qs = params.toString();
    return apiRequest<PaginatedResponse<List>>(
      `${BASE_URL}/lists${qs ? `?${qs}` : ""}`,
      {},
      apiKey,
    );
  }

  static async getList(uuid: string, apiKey: string): Promise<List> {
    return apiRequest<List>(`${BASE_URL}/lists/${uuid}`, {}, apiKey);
  }

  static async createList(data: ListInput, apiKey: string): Promise<List> {
    return apiRequest<List>(
      `${BASE_URL}/lists`,
      { method: "POST", body: JSON.stringify(data) },
      apiKey,
    );
  }

  static async updateList(
    uuid: string,
    data: Partial<ListInput>,
    apiKey: string,
  ): Promise<List> {
    return apiRequest<List>(
      `${BASE_URL}/lists/${uuid}`,
      { method: "PATCH", body: JSON.stringify(data) },
      apiKey,
    );
  }

  static async deleteList(uuid: string, apiKey: string): Promise<void> {
    await apiRequest(`${BASE_URL}/lists/${uuid}`, { method: "DELETE" }, apiKey);
  }

  static async addContacts(
    listUuid: string,
    contactUuids: string[],
    apiKey: string,
  ): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>(
      `${BASE_URL}/lists/${listUuid}/contacts`,
      { method: "POST", body: JSON.stringify({ contactUuids }) },
      apiKey,
    );
  }

  static async removeContact(
    listUuid: string,
    contactUuid: string,
    apiKey: string,
  ): Promise<void> {
    await apiRequest(
      `${BASE_URL}/lists/${listUuid}/contacts/${contactUuid}`,
      { method: "DELETE" },
      apiKey,
    );
  }
}
