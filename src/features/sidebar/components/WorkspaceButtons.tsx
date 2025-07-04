import { Link, useLocation, useParams } from 'react-router-dom';
import { ChevronDown, LayoutGrid, Plus, SquareDashedKanban } from 'lucide-react';
import Button from './Button';
import React from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectWorkspaceBoards } from '@/features/workspace/slices/workspacesSlice';
import { createBoardForWorkspace } from '@/features/workspace/slices/boardsSlice';
import { colorMap } from '@/features/workspace/types';

const WorkspaceButtons = () => {
  const workspaceId = useParams().workspaceId!;
  const location = useLocation();

  const dispatch = useAppDispatch();
  const [areBoardsHidden, setAreBoardsHidden] = React.useState(false);
  const boards = useAppSelector((state) => selectWorkspaceBoards(state, workspaceId));

  return (
    <>
      <div className="flex flex-col gap-2">
        <Button
          className={`${
            location.pathname === `/workspaces/${workspaceId}`
              ? 'bg-muted/5'
              : 'text-muted cursor-pointer hover:bg-muted/4 active:bg-muted/2'
          }`}
          asChild
        >
          <Link to={`/workspaces/${workspaceId}`}>
            <LayoutGrid size={16} className="min-w-4" />
            <span>Workspace</span>
          </Link>
        </Button>
        <Button
          className={`${
            location.pathname === `/workspaces/${workspaceId}/templates`
              ? 'bg-muted/5'
              : 'text-muted cursor-pointer hover:bg-muted/4 active:bg-muted/2'
          }`}
          asChild
        >
          <Link to={`/workspaces/${workspaceId}/templates`}>
            <SquareDashedKanban size={16} className="min-w-4" />
            <span>Templates</span>
          </Link>
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <hr className="border-border border-dashed" />
        <Button
          className={`relative justify-between cursor-pointer`}
          onClick={() => setAreBoardsHidden((prev) => !prev)}
        >
          <div className="flex flex-row items-center gap-2">
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${
                !areBoardsHidden && '-rotate-180'
              }`}
            />
            <span>Boards</span>
          </div>
          <span
            className="absolute right-1 top-1/2 -translate-y-1/2 p-1 cursor-pointer bg-muted/5 rounded-md"
            onClick={(e) => {
              e.stopPropagation();
              dispatch(createBoardForWorkspace({ workspaceId }));
            }}
          >
            <Plus size={16} />
          </span>
        </Button>
        {!areBoardsHidden &&
          boards.map((board) => (
            <Button
              className={`${
                location.pathname === `/workspaces/${workspaceId}/boards/${board.id}`
                  ? 'bg-muted/5'
                  : 'text-muted cursor-pointer hover:bg-muted/4 active:bg-muted/2'
              }`}
              asChild
            >
              <Link to={`/workspaces/${workspaceId}/boards/${board.id}`}>
                <span
                  className={`w-4 min-w-4 aspect-square rounded-sm ${
                    colorMap[board.color]
                  }`}
                ></span>
                <span>{board.name}</span>
              </Link>
            </Button>
          ))}
      </div>
    </>
  );
};

export default WorkspaceButtons;
