import { useAppSelector } from '@/app/hooks';
import { selectWorkspacesWithBoards } from '@/features/workspace/slices/workspacesSlice';
import { Board, colorMap } from '@/features/workspace/types';
import { ChevronDown } from 'lucide-react';
import React from 'react';
import Button from './Button';
import { Link } from 'react-router-dom';

const StarredGroup = ({
  wsName,
  wsId,
  boards,
}: {
  wsName: string;
  wsId: string;
  boards: Board[];
}) => {
  const [isOpen, setIsOpen] = React.useState(true);
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
        <p>{wsName}</p>
        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${!isOpen && '-rotate-180'}`}
        />
      </button>
      {isOpen &&
        starredBoards.map((board, idx) => (
          <Button asChild key={idx}>
            <Link to={`/workspaces/${wsId}/boards/${board.id}`}>
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
  const workspacesWithBoards = useAppSelector(selectWorkspacesWithBoards);

  return (
    <>
      <p className="px-4 py-3">Starred</p>
      {workspacesWithBoards.map((ws, idx) => (
        <StarredGroup key={idx} wsName={ws.name} wsId={ws.id} boards={ws.boards} />
      ))}
    </>
  );
};

export default HomeButtons;
