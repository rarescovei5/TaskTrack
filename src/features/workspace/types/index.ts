export type Color = 'blue' | 'red' | 'green' | 'pink' | 'violet' | 'orange';
export const colors: Color[] = ['blue', 'red', 'green', 'pink', 'violet', 'orange'];

export enum TaskStatus {
  NotStarted,
  InResearch,
  OnTrack,
  Completed,
}
export enum TaskPriority {
  Low,
  Medium,
  High,
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  dueDate: string | null;
  tags: string[];
  comments: string[];
  assignees: string[];
}

export interface Column {
  id: string;
  name: string;
  color: Color;
  createdAt: string;
  taskIds: string[];
}

export interface Board {
  id: string;
  name: string;
  description: string | null;
  color: Color;
  createdAt: string;
  columnIds: string[];
}

export interface Workspace {
  id: string;
  ownerId: string;
  name: string;
  description: string | null;
  imageUrl: string;
  createdAt: string;
  boardIds: string[];
  privacy: 'public' | 'private';
}
