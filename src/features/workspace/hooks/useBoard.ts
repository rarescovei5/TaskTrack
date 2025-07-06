import React from 'react';
import { Board, Column, Task } from '../types';
import { useAppSelector } from '@/app/hooks';
import { selectBoardById } from '../slices/boardsSlice';
import { makeSelectColumnsByIds } from '../slices/columnsSlice';
import { makeSelectGroupedTasksByIds } from '../slices/tasksSlice';

export function useBoard(boardId: Board['id']): {
  board: Board;
  columns: Array<Column>;
  tasksGrouped: Record<Column['id'], Task[]>;
} {
  // Board
  const board = useAppSelector((state) => selectBoardById(state, boardId));

  // Columns
  const selectColumnsByIds = React.useMemo(
    () => makeSelectColumnsByIds(board.columnIds),
    [board.columnIds]
  );
  const columns = useAppSelector(selectColumnsByIds);

  // Tasks
  const taskIds = React.useMemo(() => columns.flatMap((col) => col.taskIds), [columns]);
  const selectTasksGroupedByIds = makeSelectGroupedTasksByIds(taskIds);
  const tasksGrouped = useAppSelector(selectTasksGroupedByIds);

  return { board, columns, tasksGrouped };
}
