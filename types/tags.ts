export enum TagType {
  MAIN_GENRE = 'MAIN_GENRE',
  SUBGENRE = 'SUBGENRE',
  SUPPORTING = 'SUPPORTING',
  AUDIENCE = 'AUDIENCE'
}

export interface Tag {
  id: string;
  name: string;
  display: string;
  type: TagType;
  mainGenre?: string;
  color?: string;
  description?: string;
  isActive: boolean;
  order: number;
  metadata?: Record<string, any>;
  displayName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserTag {
  id: string;
  userId: string;
  tagId: string;
  assignedAt: string;
  tag: Tag;
}

export interface CreateTagInput {
  name: string;
  display?: string;
  type: TagType;
  mainGenre?: string;
  color?: string;
  description?: string;
  order?: number;
  isActive?: boolean;
  metadata?: Record<string, any>;
}

export interface UpdateTagInput {
  display?: string;
  color?: string;
  description?: string;
  order?: number;
  isActive?: boolean;
  metadata?: Record<string, any>;
}

export interface AssignTagsInput {
  tagIds: string[];
}

export interface TagsFilterInput {
  search?: string;
  type?: TagType;
  mainGenre?: string;
  isActive?: boolean;
}

export interface TagsSortInput {
  field: 'name' | 'display' | 'type' | 'order' | 'createdAt';
  direction: 'asc' | 'desc';
}

export interface TagsPaginatedResponse {
  edges: Array<{
    cursor: string;
    node: Tag;
  }>;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string;
    endCursor: string;
    totalCount?: number;
  };
}

export interface GenreStructure {
  mainGenres: Array<{
    id: string;
    name: string;
    display: string;
    color?: string;
    order: number;
  }>;
  subgenres: Array<{
    id: string;
    name: string;
    display: string;
    mainGenre: string;
    color?: string;
    order: number;
  }>;
  supportingTags: Array<{
    id: string;
    name: string;
    display: string;
    color?: string;
    order: number;
  }>;
  audienceTags: Array<{
    id: string;
    name: string;
    display: string;
    color?: string;
    order: number;
  }>;
}