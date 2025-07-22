import { apiRequest } from "../utils/request";
import type {
  Contact,
  ContactQuery,
  ContactSearchQuery,
} from "../types/contact.types";

const BASE_URL = "https://api.warmr.app"; // Updated to production API URL

export class ContactsService {
  static async getContacts(
    filters: ContactSearchQuery,
    apiKey: string
  ): Promise<Contact[]> {
    const filtered: Record<string, string> = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (typeof v === "string") filtered[k] = v;
    });
    const params = new URLSearchParams(filtered);
    const response = await apiRequest<any>(
      `${BASE_URL}/contacts?${params.toString()}`,
      {},
      apiKey
    );
    
    // Handle different possible response structures
    if (Array.isArray(response)) {
      return response;
    }
    
    if (response && Array.isArray(response.data)) {
      return response.data;
    }
    
    // If response is not in expected format, throw error with details
    throw new Error(`Unexpected response format: ${JSON.stringify(response)}`);
  }

  static async createContact(
    data: { linkedin_id: string } & Partial<Contact>,
    apiKey: string
  ): Promise<Contact> {
    return apiRequest<Contact>(
      `${BASE_URL}/contacts`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      apiKey
    );
  }

  static async updateContact(
    identifier: { linkedin_id?: string; email?: string; uuid?: string },
    data: Partial<Contact>,
    apiKey: string
  ): Promise<Contact> {
    // Prefer uuid, then linkedin_id, then email
    const id = identifier.uuid || identifier.linkedin_id || identifier.email;
    if (!id)
      throw new Error("Identifier required (uuid, linkedin_id, or email)");
    return apiRequest<Contact>(
      `${BASE_URL}/contacts/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
      apiKey
    );
  }

  static async deleteContact(
    identifier: {
      linkedin_id?: string;
      email?: string;
      uuid?: string;
    },
    apiKey: string
  ): Promise<void> {
    const id = identifier.uuid || identifier.linkedin_id || identifier.email;
    if (!id)
      throw new Error("Identifier required (uuid, linkedin_id, or email)");
    await apiRequest(
      `${BASE_URL}/contacts/${id}`,
      {
        method: "DELETE",
      },
      apiKey
    );
  }
}
