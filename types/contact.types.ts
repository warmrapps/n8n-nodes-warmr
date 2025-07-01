export type Contact = {
  uuid: string;
  email?: string;
  phone?: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  website?: string;
  linkedin_id?: string;
  object_urn?: string;
  score?: number;
  score_direction?: "high" | "low" | "";
  company_position?: string;
  company_name?: string;
  created_at?: string;
  updated_at?: string;
  missing_info?: boolean;
  list?: unknown;
  pipeline_stages?: unknown[];
  interests?: string[];
  headline?: string;
  entity_urn?: string;
  is_sync_pending?: boolean;
  is_relationship?: boolean;
  tags?: string[];
  latest_interaction_at?: string | null;
  general_pipeline_stage_id?: string;
  pipeline_stage_id?: string;
  pipeline_stage_uuid?: string;
  is_archived?: boolean;
  favorite?: boolean;
};

export type ContactSearchQuery = {
  listUuid?: string;
  pipelineStageUuid?: string;
  filters?: string;
  raw?: boolean;
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  uuid?: string;
  entityUrn?: string;
  objectUrn?: string;
  archived?: boolean;
};

export type ContactQuery = {
  linkedin_id?: string;
  object_urn?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  list_uuid?: string;
  general_pipeline_stage_id?: string;
  pipeline_stage_id?: string;
  pipeline_stage_uuid?: string;
};
