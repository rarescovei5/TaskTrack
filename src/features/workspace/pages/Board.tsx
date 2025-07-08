import { useAppSelector } from '@/app/hooks';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { selectWorkspaceById } from '../slices/workspacesSlice';
import Header from '../components/Header';
import Info from '../components/Info';
import BoardSettings from '../components/SettingsMenus/BoardSettings';
import BoardView from '../Views/Board/BoardView';
import TableView from '../Views/Table/TableView';
import CalendarView from '../Views/Calendar/CalendarView';
import { Funnel } from 'lucide-react';
import { useBoard } from '../hooks/useBoard';
import NavTabs from '../components/NavTabs';

const Board = () => {
  const workspaceId = useParams().workspaceId!;
  const boardId = useParams().boardId!;

  const workspaceName = useAppSelector((state) =>
    selectWorkspaceById(state, workspaceId)
  ).name;

  const { board, columns, tasksGrouped } = useBoard(boardId);

  if (!board) {
    return <Navigate to={`/workspaces/${workspaceId}/board`} replace />;
  }

  return (
    <div className="h-full flex flex-col gap-3 px-4 pt-3">
      <Header breadCrumbs={[workspaceName, board.name]} />
      <Info
        title={board.name}
        description={board.description}
        SettingsContent={<BoardSettings board={board} />}
      />
      <div className="flex justify-between border-b border-b-border">
        <NavTabs basePath={`/workspaces/${workspaceId}/boards/${boardId}`} />
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
            <BoardView
              boardId={boardId}
              isInBoard={true}
              columns={columns}
              tasksGrouped={tasksGrouped}
            />
          }
        />
        <Route
          path="table"
          element={
            <TableView
              boardId={boardId}
              isInBoard={true}
              columns={columns}
              tasksGrouped={tasksGrouped}
            />
          }
        />
        <Route
          path="calendar"
          element={
            <CalendarView
              boardId={boardId}
              isInBoard={true}
              columns={columns}
              tasksGrouped={tasksGrouped}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default Board;
