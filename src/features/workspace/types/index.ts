export type Color = 'blue' | 'red' | 'green' | 'pink' | 'violet' | 'orange';
export const colors: Color[] = ['blue', 'red', 'green', 'pink', 'violet', 'orange'];
export const colorMap: Record<Color, string> = {
  blue: 'bg-chart-1',
  red: 'bg-chart-2',
  green: 'bg-chart-3',
  pink: 'bg-chart-4',
  violet: 'bg-chart-5',
  orange: 'bg-chart-6',
};

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
  isStarred: boolean; // This should be client side
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
