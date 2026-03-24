export interface Company {
  [key: string]: any;
  uuid: string;
  name: string;
  linkedinId?: string;
  logoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanySearchQuery {
  page?: number;
  per_page?: number;
  search?: string;
}
