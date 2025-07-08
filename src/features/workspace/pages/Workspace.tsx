import Header from '../components/Header';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import Info from '../components/Info';
import WorkspaceSettings from '../components/SettingsMenus/WorkspaceSettings';
import { Funnel } from 'lucide-react';
import BoardView from '../Views/Board/BoardView';

import { useWorkspace } from '../hooks/useWorkspace';
import NavTabs from '../components/NavTabs';
import TableView from '../Views/Table/TableView';
import CalendarView from '../Views/Calendar/CalendarView';

const Workspace = () => {
  const workspaceId = useParams().workspaceId!;
  const { workspace, columns, tasksGrouped } = useWorkspace(workspaceId);

  if (!workspace) {
    return <Navigate to={`/`} replace />;
  }

  return (
    <div className="h-full flex flex-col gap-3 px-4 py-3">
      <Header breadCrumbs={[workspace.name]} />
      <Info
        title={workspace.name}
        description={workspace.description}
        SettingsContent={<WorkspaceSettings workspace={workspace} />}
      />
      <div className="flex justify-between border-b border-b-border">
        <NavTabs basePath={`/workspaces/${workspaceId}`} />
        <div>
          <button className="px-4 py-2 flex gap-2 items-center transition-colors cursor-pointer">
            <Funnel size={16} />
            Filters
          </button>
        </div>
      </div>
      {columns.length > 0 ? (
        <Routes>
          <Route
            path="board"
            element={
              <BoardView
                isInBoard={false}
                columns={columns}
                tasksGrouped={tasksGrouped}
              />
            }
          />
          <Route
            path="table"
            element={
              <TableView
                isInBoard={false}
                columns={columns}
                tasksGrouped={tasksGrouped}
              />
            }
          />
          <Route
            path="calendar"
            element={
              <CalendarView
                isInBoard={false}
                columns={columns}
                tasksGrouped={tasksGrouped}
              />
            }
          />
        </Routes>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 text-center gap-2">
          <Funnel size={32} className="text-muted" />
          <div>
            <h4 className="font-semibold text-foreground">No columns found</h4>
            <p className="text-muted">
              Start by creating a board to setup your first tasks.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workspace;
