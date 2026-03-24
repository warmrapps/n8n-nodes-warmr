export interface Tag {
  [key: string]: any;
  id: number;
  name: string;
  color: string | null;
  createdAt: string;
}

export interface TagInput {
  name: string;
  color?: string;
}
