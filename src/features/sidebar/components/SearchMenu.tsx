import { useAppSelector } from '@/app/hooks';
import { ScrollArea, ScrollViewport } from '@/components/ui/scroll-area';
import { selectGroupedBoards } from '@/features/workspace/slices/boardsSlice';
import { selectAllWorkspaces } from '@/features/workspace/slices/workspacesSlice';
import { colorMap } from '@/features/workspace/types';
import { Portal } from '@radix-ui/react-portal';
import { Command } from 'cmdk';
import { ExternalLink, Frown, Search as SearchIcon } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const SearchMenu = ({ close }: { close: () => void }) => {
  const workspaces = useAppSelector(selectAllWorkspaces);
  const groupedBoards = useAppSelector(selectGroupedBoards);

  const [query, setQuery] = React.useState('');

  return (
    <Portal
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={close}
      onKeyDown={(e) => e.key === 'Escape' && close()}
    >
      <Command
        onClick={(e) => e.stopPropagation()}
        className="
          border
          border-border
          bg-background 
          rounded-md 
          shadow-2xl 
          w-full max-w-2xl 
          h-[65vh] 
          flex flex-col 
          overflow-hidden
        "
        loop
      >
        {/* --- CUSTOM SEARCH BAR --- */}
        <Command.Input asChild>
          <div className="p-4">
            <div className="flex items-center bg-muted/5 rounded-md focus-within:ring-primary focus-within:ring-2 transition-colors">
              <SearchIcon size={20} className="ml-4 text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search boards…"
                className="
                flex-1 
                bg-transparent 
                py-3 
                px-4 
                text-base 
                text-foreground 
                placeholder:text-muted 
                focus:outline-none
                "
                autoFocus
              />
            </div>
          </div>
        </Command.Input>

        <hr className="border-border" />

        {/* --- RESULTS LIST --- */}
        <Command.List className="flex-1 flex flex-col min-h-0 [&>div]:min-h-0">
          {/* No Results */}
          <Command.Empty className="flex flex-col items-center justify-center text-muted h-full gap-4">
            <Frown size={56} />
            <h6 className="text-lg font-medium">No Results</h6>
            <p className="text-sm">Try different keywords.</p>
          </Command.Empty>

          <ScrollArea className="h-full">
            <ScrollViewport className="p-4 [&>div]:space-y-6">
              {/* Grouped Results */}
              {workspaces.map((ws, workspaceIdx) => {
                const boards = groupedBoards[ws.id] ?? [];
                return (
                  boards.length > 0 && (
                    <Command.Group
                      key={workspaceIdx}
                      heading={ws.name}
                      className="space-y-2 [&>[cmdk-group-heading]]:text-muted [&>[cmdk-group-items]]:space-y-2"
                    >
                      {boards.map((board, boardIdx) => (
                        <Command.Item
                          key={boardIdx}
                          value={`${board.id}__${board.name}`}
                          onSelect={() => close()}
                          className=" 
                        group
                        p-3 
                        rounded-lg 
                        data-[selected=true]:bg-muted/5
                     
                      "
                          asChild
                        >
                          <Link
                            to={`/workspaces/${ws.id}/boards/${board.id}/board`}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`
                            w-4 h-4 rounded-sm
                            ${colorMap[board.color]}
                          `}
                              />
                              <span className="text-base font-medium">{board.name}</span>
                            </div>
                            <ExternalLink
                              size={18}
                              className="text-muted opacity-0 group-data-[selected=true]:opacity-100 transition-opacity"
                            />
                          </Link>
                        </Command.Item>
                      ))}
                    </Command.Group>
                  )
                );
              })}
            </ScrollViewport>
          </ScrollArea>
        </Command.List>
      </Command>
    </Portal>
  );
};

export default SearchMenu;
