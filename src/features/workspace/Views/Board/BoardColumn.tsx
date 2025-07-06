import { colorMap, Column, Task } from '../../types';
import { ChevronsRightLeft, Ellipsis, Plus } from 'lucide-react';
import BoardTask from './BoardTask';
import { useAppDispatch } from '@/app/hooks';
import { createTaskForColumn } from '../../slices/tasksSlice';
import { ScrollArea, ScrollViewport } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import ColumnSettings from '../../components/ColumnSettings';

const BoardColumn = ({ col, tasks }: { col: Column; tasks: Task[] }) => {
  const dispatch = useAppDispatch();

  return (
    <div className="h-full flex flex-col gap-4 px-4 py-3 bg-muted/5 rounded-md xl:basis-[calc((100%_-_2rem)/3)] lg:basis-[calc((100%_-_1rem)/2)] basis-full shrink-0">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <span className={`w-4 h-4 ${colorMap[col.color]} rounded-sm`} />
          <p>{col.name}</p>
        </div>
        <div className="flex gap-2 items-center">
          <ChevronsRightLeft size={16} className="cursor-pointer" />
          <Plus
            size={16}
            className="cursor-pointer"
            onClick={() => dispatch(createTaskForColumn({ columnId: col.id }))}
          />
          <Dialog>
            <DialogTrigger>
              <Ellipsis size={16} className="cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="top-4 bottom-4 right-4 translate-y-0 translate-x-0 flex flex-col gap-3 left-[unset]">
              <ColumnSettings column={col} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* Tasks */}
      <ScrollArea className="flex-1 min-h-0">
        <ScrollViewport className="[&>div]:!flex [&>div]:flex-col [&>div]:gap-2">
          {tasks.map((task) => (
            <BoardTask key={task.id} task={task} />
          ))}
        </ScrollViewport>
      </ScrollArea>
    </div>
  );
};

export default BoardColumn;
