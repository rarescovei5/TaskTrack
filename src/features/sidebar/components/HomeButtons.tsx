import { useAppSelector } from '@/app/hooks';

import { colorMap, Workspace } from '@/features/workspace/types';
import { ChevronDown } from 'lucide-react';
import React from 'react';
import Button from './Button';
import { Link } from 'react-router-dom';
import { selectAllWorkspaces } from '@/features/workspace/slices/workspacesSlice';
import { makeSelectBoardsByIds } from '@/features/workspace/slices/boardsSlice';

const StarredGroup = ({ ws }: { ws: Workspace }) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const selectBoardsByIds = React.useMemo(
    () => makeSelectBoardsByIds(ws.boardIds),
    [ws.boardIds]
  );
  const boards = useAppSelector(selectBoardsByIds);

  const starredBoards = React.useMemo(
    () => boards.filter((board) => board.isStarred),
    [boards]
  );

  return starredBoards.length > 0 ? (
    <div className="flex flex-col gap-2">
      <button
        className="px-4 py-3 flex flex-row justify-between items-center cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <p>{ws.name}</p>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${!isOpen && '-rotate-180'}`}
        />
      </button>
      {isOpen &&
        starredBoards.map((board, idx) => (
          <Button asChild key={idx}>
            <Link to={`/workspaces/${ws.id}/boards/${board.id}/board`}>
              <span className={`w-4 h-4 rounded-sm ${colorMap[board.color]}`}></span>
              <span>{board.name}</span>
            </Link>
          </Button>
        ))}
    </div>
  ) : (
    <></>
  );
};

const HomeButtons = () => {
  const workspaces = useAppSelector(selectAllWorkspaces);

  return (
    <>
      <p className="px-4 py-3">Starred</p>
      {workspaces.map((ws, idx) => (
        <StarredGroup key={idx} ws={ws} />
      ))}
    </>
  );
};

export default HomeButtons;
