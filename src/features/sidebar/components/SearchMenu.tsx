import { useAppSelector } from '@/app/hooks';
import Searchbar from '@/components/ui/Searchbar';
import { selectWorkspacesWithBoards } from '@/features/workspace/slices/workspacesSlice';
import { colorMap } from '@/features/workspace/types';
import { Portal } from '@radix-ui/react-portal';
import { Command } from 'cmdk';
import { ExternalLink, Frown } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const SearchMenu = ({ close }: { close: () => void }) => {
  const workspaces = useAppSelector(selectWorkspacesWithBoards);

  return (
    <Portal
      className="fixed inset-0 z-50 flex items-center justify-center bg-muted/5 backdrop-blur-xs"
      onClick={close}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          close();
        }
      }}
    >
      <Command
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="bg-background rounded-md h-1/2 w-full max-w-lg border border-border flex flex-col gap-3"
        loop
      >
        <Command.Input autoFocus asChild>
          <Searchbar
            placeholder="Search for boards..."
            className="placeholder:text-muted mx-4 mt-3"
          />
        </Command.Input>
        <Command.Separator className="bg-border h-px" />
        <Command.List className="flex-1 [&>div]:flex [&>div]:flex-col [&>div]:h-full [&>div]:gap-1 px-2 overflow-x-hidden overflow-y-auto scroll-py-2">
          <Command.Empty className="flex flex-col items-center justify-center h-full text-muted flex-1 gap-3">
            <Frown size={48} />
            <div className="text-center">
              <h6>No Results Found!</h6>
              <p className="text-muted">Try adjusting your search query.</p>
            </div>
          </Command.Empty>
          {workspaces.map((ws, idx) =>
            ws.boards.length ? (
              <Command.Group
                key={idx}
                heading={ws.name}
                className="flex flex-col gap-1 [&>div]:flex [&>div]:flex-col [&>div]:gap-1 "
              >
                {ws.boards.map((board, idx) => (
                  <Command.Item
                    key={idx}
                    value={`${board.id}__${board.name}`}
                    className="flex items-center justify-between px-6 py-3 active:bg-muted/5 cursor-pointer rounded-md data-[selected=true]:bg-muted/5"
                    onClick={() => {
                      close();
                    }}
                  >
                    <Link
                      to={`/workspaces/${ws.id}/board/${board.id}`}
                      className="flex items-center gap-2 "
                    >
                      <span
                        className={`w-4 aspect-square rounded-md ${
                          colorMap[board.color]
                        }`}
                      ></span>
                      <span>{board.name}</span>
                    </Link>
                    <ExternalLink className="hidden" size={16} />
                  </Command.Item>
                ))}
              </Command.Group>
            ) : (
              <React.Fragment key={idx}></React.Fragment>
            )
          )}
        </Command.List>
      </Command>
    </Portal>
  );
};

export default SearchMenu;
