import React from 'react';
import Header from '../components/Header';
import { NavLink, Route, Routes, useParams } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import {
  makeSelectWorkspaceColumnsWithTasks,
  selectWorkspaceById,
} from '../slices/workspacesSlice';
import Info from '../components/Info';
import WorkspaceSettings from '../components/WorkspaceSettings';
import { Calendar, Funnel, Kanban, Table } from 'lucide-react';
import BoardView from '../components/BoardView';
import TableView from '../components/TableView';
import CalendarView from '../components/CalendarView';

const Workspace = () => {
  const workspaceId = useParams().workspaceId!;
  const workspace = useAppSelector((state) => selectWorkspaceById(state, workspaceId));

  const selectWorkspaceColumnsWithTasks = React.useMemo(
    () => makeSelectWorkspaceColumnsWithTasks(),
    []
  );
  const tasks = useAppSelector((state) =>
    selectWorkspaceColumnsWithTasks(state, workspaceId)
  );

  const [query, setQuery] = React.useState('');

  return (
    <div className="h-full flex flex-col gap-3 px-4 py-3">
      <Header breadCrumbs={[workspace.name]} query={query} setQuery={setQuery} />
      <Info
        title={workspace.name}
        description={workspace.description}
        SettingsContent={<WorkspaceSettings workspace={workspace} />}
      />
      <div className="flex justify-between border-b border-b-border">
        <div className="flex items-center relative">
          {[
            { to: `/workspaces/${workspaceId}/board`, Icon: Kanban, label: 'Board' },
            { to: `/workspaces/${workspaceId}/table`, Icon: Table, label: 'Table' },
            {
              to: `/workspaces/${workspaceId}/calendar`,
              Icon: Calendar,
              label: 'Calendar',
            },
          ].map(({ to, Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              replace
              className={({ isActive }) => `
                    px-4 py-3 flex gap-2 items-center transition-colors duration-300 relative
                    after:content-[''] after:absolute after:bottom-0 after:left-0
                    after:w-full after:h-[2px] after:bg-primary
                    after:origin-center after:transition-transform after:duration-300
                    ${
                      isActive
                        ? 'text-primary after:scale-x-100'
                        : 'text-muted after:scale-x-0'
                    }
                `}
            >
              <Icon size={16} />
              <p>{label}</p>
            </NavLink>
          ))}
        </div>
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
          element={<BoardView isInBoard={false} columnsWithTasks={tasks} query={query} />}
        />
        <Route
          path="table"
          element={<TableView isInBoard={false} columnsWithTasks={tasks} query={query} />}
        />
        <Route
          path="calendar"
          element={
            <CalendarView isInBoard={false} columnsWithTasks={tasks} query={query} />
          }
        />
      </Routes>
    </div>
  );
};

export default Workspace;
