import Searchbar from '@/components/ui/Searchbar';
import { Portal } from '@radix-ui/react-portal';
import { Command } from 'cmdk';
import { ExternalLink, Frown } from 'lucide-react';

const SearchMenu = ({ close }: { close: () => void }) => {
  return (
    <Portal
      className="fixed inset-0 z-50 flex items-center justify-center bg-border/25 backdrop-blur-xs"
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
          {Array.from({ length: 4 }).map((_, i) => (
            <Command.Item
              key={i}
              value={`Board ${i + 1}`}
              className="flex items-center justify-between px-6 py-3 hover:bg-border active:bg-border/75 cursor-pointer rounded-md data-[selected=true]:bg-border/50"
              onClick={() => {
                close();
              }}
            >
              <div className="flex items-center gap-2 ">
                <span className={`w-4 aspect-square bg-chart-3 rounded-md`}></span>
                <p>Board {i + 1}</p>
              </div>

              <ExternalLink className="hidden" size={16} />
            </Command.Item>
          ))}
        </Command.List>
      </Command>
    </Portal>
  );
};

export default SearchMenu;
