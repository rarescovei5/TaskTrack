import { useAppSelector } from '@/app/hooks';
import { Column, Task, Workspace } from '../types';
import { selectWorkspaceById } from '../slices/workspacesSlice';
import { makeSelectBoardsByIds } from '../slices/boardsSlice';
import React from 'react';
import { makeSelectColumnsByIds } from '../slices/columnsSlice';
import { makeSelectGroupedTasksByIds } from '../slices/tasksSlice';

export function useWorkspace(workspaceId: Workspace['id']): {
  workspace: Workspace;
  columns: Array<Column>;
  tasksGrouped: Record<Column['id'], Task[]>;
} {
  // Workspace
  const workspace = useAppSelector((state) => selectWorkspaceById(state, workspaceId));

  // Columns
  const selectBoardsByIds = React.useMemo(
    () => makeSelectBoardsByIds(workspace.boardIds),
    [workspace.boardIds]
  );
  const boards = useAppSelector(selectBoardsByIds);

  // Columns
  const columnIds = boards.flatMap((board) => board.columnIds);
  const selectColumnsByIds = React.useMemo(
    () => makeSelectColumnsByIds(columnIds),
    [columnIds]
  );
  const columns = useAppSelector(selectColumnsByIds);

  // Tasks
  const taskIds = React.useMemo(() => columns.flatMap((col) => col.taskIds), [columns]);
  const selectTasksGroupedByIds = makeSelectGroupedTasksByIds(taskIds);
  const tasksGrouped = useAppSelector(selectTasksGroupedByIds);

  // Tasks
  return { workspace, columns, tasksGrouped };
}
