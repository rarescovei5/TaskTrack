import { useAppSelector } from '@/app/hooks';
import React from 'react';
import { useParams } from 'react-router-dom';
import { selectWorkspaceById } from '../slices/workspacesSlice';
import Header from '../components/Header';
import { selectBoardById } from '../slices/boardsSlice';

const Board = () => {
  const workspaceId = useParams().workspaceId!;
  const boardId = useParams().boardId!;

  const workspaceName = useAppSelector((state) =>
    selectWorkspaceById(state, workspaceId)
  ).name;
  const board = useAppSelector((state) => selectBoardById(state, boardId));

  const [query, setQuery] = React.useState('');
  return (
    <div className="h-full flex flex-col gap-3 px-4 py-3">
      <Header
        breadCrumbs={[workspaceName, board.name]}
        query={query}
        setQuery={setQuery}
      />
    </div>
  );
};

export default Board;
