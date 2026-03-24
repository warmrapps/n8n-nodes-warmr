export interface Contact {
  [key: string]: any;
  uuid: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  website?: string;
  headline?: string;
  location?: string;
  countryIso?: string;
  avatarUrl?: string;
  linkedinId?: string;
  score?: number;
  followersCount?: number;
  isPremium?: boolean;
  isCreator?: boolean;
  isInfluencer?: boolean;
  archived?: boolean;
  isFavorite?: boolean;
  listUuids?: string[];
  companyUuids?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  website?: string;
  headline?: string;
  location?: string;
  countryIso?: string;
  archived?: boolean;
  isFavorite?: boolean;
}

export interface ContactSearchQuery {
  page?: number;
  per_page?: number;
  search?: string;
  list_uuid?: string;
  archived?: boolean;
  is_favorite?: boolean;
}

export interface PaginatedResponse<T> {
  [key: string]: any;
  data: T[];
  meta?: {
    currentPage: number;
    perPage: number;
    total: number;
  };
}
