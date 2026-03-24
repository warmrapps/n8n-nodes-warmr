import { apiRequest } from "../utils/request";
import type {
  Contact,
  ContactInput,
  ContactSearchQuery,
  PaginatedResponse,
} from "../types/contact.types";

const BASE_URL = "https://api.warmr.app/v1";

export class ContactsService {
  static async getContacts(
    query: ContactSearchQuery,
    apiKey: string,
  ): Promise<PaginatedResponse<Contact>> {
    const params = new URLSearchParams();

    if (query.page) params.set("page", String(query.page));
    if (query.per_page) params.set("per_page", String(query.per_page));
    if (query.search) params.set("search", query.search);
    if (query.list_uuid) params.set("list_uuid", query.list_uuid);
    if (query.archived !== undefined) params.set("archived", String(query.archived));
    if (query.is_favorite !== undefined) params.set("is_favorite", String(query.is_favorite));

    const qs = params.toString();
    return apiRequest<PaginatedResponse<Contact>>(
      `${BASE_URL}/contacts${qs ? `?${qs}` : ""}`,
      {},
      apiKey,
    );
  }

  static async getContact(uuid: string, apiKey: string): Promise<Contact> {
    return apiRequest<Contact>(`${BASE_URL}/contacts/${uuid}`, {}, apiKey);
  }

  static async createContact(data: ContactInput, apiKey: string): Promise<Contact> {
    return apiRequest<Contact>(
      `${BASE_URL}/contacts`,
      { method: "POST", body: JSON.stringify(data) },
      apiKey,
    );
  }

  static async updateContact(
    uuid: string,
    data: Partial<ContactInput>,
    apiKey: string,
  ): Promise<Contact> {
    return apiRequest<Contact>(
      `${BASE_URL}/contacts/${uuid}`,
      { method: "PATCH", body: JSON.stringify(data) },
      apiKey,
    );
  }

  static async deleteContact(uuid: string, apiKey: string): Promise<void> {
    await apiRequest(`${BASE_URL}/contacts/${uuid}`, { method: "DELETE" }, apiKey);
  }
}
