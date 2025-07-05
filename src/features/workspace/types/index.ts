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
  members: Member[];
  privacy: 'public' | 'private';
}
export interface Member {
  userId: string;
  username: string;
  profilePictureUrl: string;
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
  comments: Comment[];
  assignees: Member[];
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  message: string;
  createdAt: string;
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
