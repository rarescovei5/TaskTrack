import { useAppSelector } from '@/app/hooks';
import React from 'react';
import { NavLink, Route, Routes, useParams } from 'react-router-dom';
import { selectWorkspaceById } from '../slices/workspacesSlice';
import Header from '../components/Header';
import { makeSelectBoardColumnsWithTasks, selectBoardById } from '../slices/boardsSlice';
import Info from '../components/Info';
import BoardSettings from '../components/BoardSettings';
import BoardView from '../components/BoardView';
import TableView from '../components/TableView';
import CalendarView from '../components/CalendarView';
import { Calendar, Funnel, Kanban, Table } from 'lucide-react';

const Board = () => {
  const workspaceId = useParams().workspaceId!;
  const boardId = useParams().boardId!;

  const workspaceName = useAppSelector((state) =>
    selectWorkspaceById(state, workspaceId)
  ).name;
  const board = useAppSelector((state) => selectBoardById(state, boardId));

  const selectColumnsWithTasks = React.useMemo(
    () => makeSelectBoardColumnsWithTasks(),
    []
  );
  const tasks = useAppSelector((state) => selectColumnsWithTasks(state, boardId));

  React.useEffect(() => console.log('rerender'), [tasks]);

  const [query, setQuery] = React.useState('');
  return (
    <div className="h-full flex flex-col gap-3 px-4 pt-3">
      <Header
        breadCrumbs={[workspaceName, board.name]}
        query={query}
        setQuery={setQuery}
      />
      <Info
        title={board.name}
        description={board.description}
        SettingsContent={<BoardSettings board={board} />}
      />
      <div className="flex justify-between border-b border-b-border">
        <div className="flex items-center relative">
          {[
            {
              to: `/workspaces/${workspaceId}/boards/${boardId}/board`,
              Icon: Kanban,
              label: 'Board',
            },
            {
              to: `/workspaces/${workspaceId}/boards/${boardId}/table`,
              Icon: Table,
              label: 'Table',
            },
            {
              to: `/workspaces/${workspaceId}/boards/${boardId}/calendar`,
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
          element={<BoardView isInBoard={true} columnsWithTasks={tasks} query={query} />}
        />
        <Route
          path="table"
          element={<TableView isInBoard={true} columnsWithTasks={tasks} query={query} />}
        />
        <Route
          path="calendar"
          element={
            <CalendarView isInBoard={true} columnsWithTasks={tasks} query={query} />
          }
        />
      </Routes>
    </div>
  );
};

export default Board;
