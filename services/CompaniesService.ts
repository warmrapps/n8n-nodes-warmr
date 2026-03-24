import { apiRequest } from "../utils/request";
import type { Company, CompanySearchQuery } from "../types/company.types";
import type { PaginatedResponse } from "../types/contact.types";

const BASE_URL = "https://api.warmr.app/v1";

export class CompaniesService {
  static async getCompanies(
    query: CompanySearchQuery,
    apiKey: string,
  ): Promise<PaginatedResponse<Company>> {
    const params = new URLSearchParams();

    if (query.page) params.set("page", String(query.page));
    if (query.per_page) params.set("per_page", String(query.per_page));
    if (query.search) params.set("search", query.search);

    const qs = params.toString();
    return apiRequest<PaginatedResponse<Company>>(
      `${BASE_URL}/companies${qs ? `?${qs}` : ""}`,
      {},
      apiKey,
    );
  }

  static async getCompany(uuid: string, apiKey: string): Promise<Company> {
    return apiRequest<Company>(`${BASE_URL}/companies/${uuid}`, {}, apiKey);
  }
}
