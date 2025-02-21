//----------------------- Board Related Types -----------------------
interface toDo {
  title: string;
  description: string;
  isCompleted: boolean;
  priority: 'Low' | 'Medium' | 'High';
  labels: string[];
  dueDate: Date | null;
  createdDate: Date;
}
interface Card {
  title: string;
  content: Array<toDo>;
  isCollapsed: boolean;
}
interface Board {
  title: string;
  views: Array<'Board' | 'Table'>;
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

//Extra
interface TableViewProps extends toDo {
  originList: string;
  boardId: number;
  listId: number;
  id: number;
}

export type {
  App,
  Workspace,
  AppSettings,
  Templates,
  Board,
  Card,
  toDo,
  TableViewProps,
};
