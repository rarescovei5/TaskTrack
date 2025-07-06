import React from 'react';
import { Board, Column, Task } from '../types';
import { useAppSelector } from '@/app/hooks';
import { selectBoardById } from '../slices/boardsSlice';
import { makeSelectColumnsByIds } from '../slices/columnsSlice';
import { makeSelectGroupedTasksByIds } from '../slices/tasksSlice';
import { useNavigate } from 'react-router-dom';

export function useBoard(boardId: Board['id']): {
  board: Board;
  columns: Column[];
  tasksGrouped: Record<Column['id'], Task[]>;
} {
  const navigate = useNavigate();
  // Board
  const board = useAppSelector((state) => selectBoardById(state, boardId));
  if (!board) navigate(-1);

  // Columns
  const selectColumnsByIds = React.useMemo(
    () => makeSelectColumnsByIds(board.columnIds),
    [board.columnIds]
  );
  const columns = useAppSelector(selectColumnsByIds);

  // Tasks
  const taskIds = React.useMemo(() => columns.flatMap((col) => col.taskIds), [columns]);
  const selectTasksGroupedByIds = React.useMemo(
    () => makeSelectGroupedTasksByIds(taskIds),
    [taskIds]
  );
  const tasksGrouped = useAppSelector(selectTasksGroupedByIds);

  return { board, columns, tasksGrouped };
}
