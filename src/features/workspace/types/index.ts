import { Prettify } from '@/types';

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

export interface Board {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  color: Color;
  createdAt: string;
  isStarred: boolean;
  columnIds: string[];
}

export interface Column {
  id: string;
  boardId: string;
  name: string;
  color: Color;
  createdAt: string;
  taskIds: string[];
}

export interface Task {
  id: string;
  columnId: string;
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

// Other
export type ColumnWithTasks = Prettify<Omit<Column, 'taskIds'> & { tasks: Task[] }>;
