export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  createdAt: string;
  dueDate?: string;
  tags: string[];
  comments: string[];
  assignees: string[];
}

export interface Column {
  id: string;
  name: string;
  color?: string;
  createdAt: string;
  taskIds: string[];
}

export interface Board {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: string;
  columnIds: string[];
}

export interface Workspace {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  boardIds: string[];
  privacy: 'public' | 'private';
}

// Helper type
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
