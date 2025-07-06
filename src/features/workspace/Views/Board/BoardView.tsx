import { ViewProps } from '../../types';
import { Plus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { createColumnForBoard } from '../../slices/columnsSlice';
import { useAppDispatch } from '@/app/hooks';
import BoardColumn from './BoardColumn';
import { ScrollArea, ScrollBar, ScrollViewport } from '@/components/ui/scroll-area';

const BoardView = ({ isInBoard, columns, tasksGrouped }: ViewProps) => {
  const dispatch = useAppDispatch();
  const boardId = useParams().boardId!;

  return (
    <div className={`min-h-0 flex-1 relative ${isInBoard && 'pr-12'}`}>
      <ScrollArea className="h-full w-full">
        <ScrollViewport className="[&>div]:!flex [&>div]:!gap-4 [&>div]:h-full [&>div]:pb-3">
          {columns.map((col, idx) => (
            // Columns may not have tasks, in that case `tasksGrouped[col.id]` is undefined
            <BoardColumn key={idx} col={col} tasks={tasksGrouped[col.id] ?? []} />
          ))}
        </ScrollViewport>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {isInBoard && (
        <div className="absolute right-0 top-0 rounded-md border border-border p-2 cursor-pointer">
          <Plus size={16} onClick={() => dispatch(createColumnForBoard({ boardId }))} />
        </div>
      )}
    </div>
  );
};

export default BoardView;
