import { useAppSelector } from "@/app/hooks";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { selectWorkspaceById } from "../slices/workspacesSlice";
import Header from "../components/Header";
import Info from "../components/Info";
import BoardSettings from "../components/SettingsMenus/BoardSettings";
import BoardView from "../Views/Board/BoardView";
import TableView from "../Views/Table/TableView";
import CalendarView from "../Views/Calendar/CalendarView";
import { Funnel } from "lucide-react";
import NavTabs from "../components/NavTabs";
import { selectBoardById } from "../slices/boardsSlice";
import ViewControls from "../components/ViewControls";

const Board = () => {
  const workspaceId = useParams().workspaceId!;
  const boardId = useParams().boardId!;

  const workspaceName = useAppSelector((state) =>
    selectWorkspaceById(state, workspaceId)
  ).name;

  const board = useAppSelector((state) => selectBoardById(state, boardId));

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
      <ViewControls basePath={`/workspaces/${workspaceId}/boards/${boardId}`} />
      <Routes>
        <Route
          path="board"
          element={
            <BoardView
              boardId={boardId}
              isInBoard={true}
              columnIds={board.columnIds}
            />
          }
        />
        <Route
          path="table"
          element={<TableView boardId={boardId} isInBoard={true} />}
        />
        <Route
          path="calendar"
          element={<CalendarView boardId={boardId} isInBoard={true} />}
        />
      </Routes>
    </div>
  );
};

export default Board;
