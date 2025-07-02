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
  updatedAt?: string;
  taskIds: string[]; // ← normalized!
}

export interface Board {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: string;
  updatedAt?: string;
  columnIds: string[]; // ← normalized!
}

export interface Workspace {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt?: string;
  boardIds: string[]; // ← normalized!
}

// Helper type
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
