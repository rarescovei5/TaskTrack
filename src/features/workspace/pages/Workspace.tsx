import Header from "../components/Header";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import Info from "../components/Info";
import WorkspaceSettings from "../components/SettingsMenus/WorkspaceSettings";
import { Funnel } from "lucide-react";
import BoardView from "../Views/Board/BoardView";
import TableView from "../Views/Table/TableView";
import CalendarView from "../Views/Calendar/CalendarView";
import { selectWorkspaceById } from "../slices/workspacesSlice";
import { useAppSelector } from "@/app/hooks";
import React from "react";
import { makeSelectBoardsByIds } from "../slices/boardsSlice";
import ViewControls from "../components/ViewControls";

const Workspace = () => {
  const workspaceId = useParams().workspaceId!;

  const workspace = useAppSelector((state) =>
    selectWorkspaceById(state, workspaceId)
  );

  const selectBoardsByIds = React.useMemo(
    () => makeSelectBoardsByIds(workspace?.boardIds ?? []),
    [workspace?.boardIds]
  );
  const boards = useAppSelector(selectBoardsByIds);
  const columnIds = React.useMemo(
    () => boards.flatMap((b) => b?.columnIds),
    [boards]
  );

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
      <ViewControls basePath={`/workspaces/${workspaceId}`} />
      {columnIds.length > 0 ? (
        <Routes>
          <Route
            path="board"
            element={<BoardView isInBoard={false} columnIds={columnIds} />}
          />
          <Route
            path="table"
            element={<TableView isInBoard={false} columnIds={columnIds} />}
          />
          <Route
            path="calendar"
            element={<CalendarView isInBoard={false} columnIds={columnIds} />}
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
