import React from 'react';
import Header from '../components/Header';
import { Route, Routes, useParams } from 'react-router-dom';
import Info from '../components/Info';
import WorkspaceSettings from '../components/WorkspaceSettings';
import { Funnel } from 'lucide-react';
import BoardView from '../Views/Board/BoardView';

import { useWorkspace } from '../hooks/useWorkspace';
import NavTabs from '../components/NavTabs';
import TableView from '../Views/Table/TableView';
import CalendarView from '../Views/Calendar/CalendarView';

const Workspace = () => {
  const workspaceId = useParams().workspaceId!;
  const { workspace, columns, tasksGrouped } = useWorkspace(workspaceId);

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
      <Routes>
        <Route
          path="board"
          element={
            <BoardView isInBoard={false} columns={columns} tasksGrouped={tasksGrouped} />
          }
        />
        <Route
          path="table"
          element={
            <TableView isInBoard={false} columns={columns} tasksGrouped={tasksGrouped} />
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
    </div>
  );
};

export default Workspace;
