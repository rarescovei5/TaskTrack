import React from 'react';
import { useAppSelector } from '@/app/hooks';
import { Column, Task, Workspace } from '../types';
import { selectWorkspaceById } from '../slices/workspacesSlice';
import { makeSelectBoardsByIds } from '../slices/boardsSlice';
import { makeSelectColumnsByIds } from '../slices/columnsSlice';
import { makeSelectGroupedTasksByIds } from '../slices/tasksSlice';

export function useWorkspace(workspaceId: Workspace['id']): {
  workspace: Workspace;
  columns: Column[];
  tasksGrouped: Record<Column['id'], Task[]>;
} {
  // Workspace
  const workspace = useAppSelector((state) => selectWorkspaceById(state, workspaceId));

  // Boards
  const selectBoardsByIds = React.useMemo(
    () => makeSelectBoardsByIds(workspace?.boardIds ?? []),
    [workspace?.boardIds]
  );
  const boards = useAppSelector(selectBoardsByIds);

  // Columns
  const columnIds = React.useMemo(() => boards.flatMap((b) => b.columnIds), [boards]);
  const selectColumnsByIds = React.useMemo(
    () => makeSelectColumnsByIds(columnIds),
    [columnIds]
  );
  const columns = useAppSelector(selectColumnsByIds);

  // Tasks
  const taskIds = React.useMemo(() => columns.flatMap((c) => c.taskIds), [columns]);
  const selectTasksGroupedByIds = React.useMemo(
    () => makeSelectGroupedTasksByIds(taskIds),
    [taskIds]
  );
  const tasksGrouped = useAppSelector(selectTasksGroupedByIds);

  return { workspace, columns, tasksGrouped };
}
