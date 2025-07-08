import { colorMap, Column } from '../../types';
import { ChevronsRightLeft, Ellipsis, Plus } from 'lucide-react';
import BoardTask from './BoardTask';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { createTaskForColumn } from '../../slices/tasksSlice';
import { ScrollArea, ScrollViewport } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import ColumnSettings from '../../components/SettingsMenus/ColumnSettings';
import { selectColumnById } from '../../slices/columnsSlice';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const BoardColumn = ({ columnId }: { columnId: Column['id'] }) => {
  const dispatch = useAppDispatch();
  const column = useAppSelector((state) => selectColumnById(state, columnId));

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({
      id: columnId,
      data: {
        type: 'Column',
      },
    });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (!column) return null;

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-full flex flex-col gap-4 min-w-0 px-4 py-3 bg-muted/1 border border-dashed border-primary rounded-md xl:basis-[calc((100%_-_2rem)/3)] lg:basis-[calc((100%_-_1rem)/2)] basis-full shrink-0"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="h-full flex flex-col gap-4 min-w-0 px-4 py-3 bg-muted/5 rounded-md xl:basis-[calc((100%_-_2rem)/3)] lg:basis-[calc((100%_-_1rem)/2)] basis-full shrink-0"
    >
      {/* Header/Handle */}
      <div {...attributes} {...listeners} className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <span className={`w-4 h-4 ${colorMap[column.color]} rounded-sm`} />
          <p>{column.name}</p>
        </div>
        <div className="flex gap-2 items-center">
          <ChevronsRightLeft size={16} className="cursor-pointer" />
          <Plus
            size={16}
            className="cursor-pointer"
            onClick={() => dispatch(createTaskForColumn({ columnId: column.id }))}
          />
          <Dialog>
            <DialogTrigger>
              <Ellipsis size={16} className="cursor-pointer" />
            </DialogTrigger>
            <DialogContent
              className="top-4 bottom-4 right-4 translate-y-0 translate-x-0 flex flex-col gap-3 left-[unset]"
              aria-describedby={undefined}
            >
              <ColumnSettings column={column} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* Tasks */}
      <ScrollArea className="flex-1 min-h-0">
        <ScrollViewport className="[&>div]:!flex [&>div]:flex-col [&>div]:gap-2 [&>div]:min-w-0">
          {column.taskIds.map((taskId) => (
            <BoardTask key={taskId} taskId={taskId} />
          ))}
        </ScrollViewport>
      </ScrollArea>
    </div>
  );
};

export default BoardColumn;
