//----------------------- Board Related Types -----------------------
interface toDo {
  title: string;
  description: string;
  isCompleted: boolean;
  priority: 'Low' | 'Medium' | 'High';
  labels: string[];
  dueDate: Date;
  createdDate: Date;
}
interface Card {
  title: string;
  content: Array<toDo>;
  isCollapsed: boolean;
}
interface Board {
  title: string;
  views: Array<'Board' | 'Table' | 'Calendar'>;
  cards: Array<Card>;
  bgColor: 'red' | 'blue' | 'orange';
  isFavorite: boolean;
}
//----------------------- Workspace Related Types -----------------------
interface WorkspaceSettings {}
interface Workspace {
  name: string;
  settings: WorkspaceSettings;
  boards: Array<Board>;
  selectedMenu: number;
}

//----------------------- App Related Types -----------------------
interface AppSettings {
  theme: 'light' | 'dark';
  isCollapsed: boolean;
}
interface Templates {
  boards: Array<Board>;
  workspaces: Array<Workspace>;
}
interface App {
  workspaces: Array<Workspace>;
  templates: Templates;
  settings: AppSettings;
}

export type { App, Workspace, AppSettings, Templates, Board, Card, toDo };
