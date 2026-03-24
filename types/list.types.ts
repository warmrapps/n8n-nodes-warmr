export interface List {
  [key: string]: any;
  uuid: string;
  name: string;
  description?: string;
  icon?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListInput {
  name: string;
  description?: string;
  icon?: string;
}

export interface ListSearchQuery {
  page?: number;
  per_page?: number;
}
