import { Column, ViewProps } from '../../types';
import { Plus } from 'lucide-react';
import { createColumnForBoard } from '../../slices/columnsSlice';
import { useAppDispatch } from '@/app/hooks';
import { DraggableBoard } from './BoardColumn';
import { ScrollArea, ScrollBar, ScrollViewport } from '@/components/ui/scroll-area';
import React from 'react';

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { updateBoard } from '../../slices/boardsSlice';

const BoardView = ({ boardId, isInBoard, columnIds }: ViewProps) => {
  const dispatch = useAppDispatch();

  const [activeColumnId, setActiveColumnId] = React.useState<Column['id'] | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  return (
    <div className={`min-h-0 flex-1 relative ${isInBoard && 'pr-12'}`}>
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <ScrollArea className="h-full w-full">
          <ScrollViewport className="[&>div]:!flex [&>div]:!gap-4 [&>div]:h-full [&>div]:pb-3">
            <SortableContext items={columnIds}>
              {columnIds.map((columnId) => (
                <DraggableBoard key={columnId} columnId={columnId} />
              ))}
            </SortableContext>
          </ScrollViewport>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {createPortal(
          <DragOverlay>
            {activeColumnId && (
              <DraggableBoard key={activeColumnId} columnId={activeColumnId} />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>

      {isInBoard && (
        <div className="absolute right-0 top-0 rounded-md border border-border p-2 cursor-pointer">
          <Plus size={16} onClick={() => dispatch(createColumnForBoard({ boardId }))} />
        </div>
      )}
    </div>
  );

  function onDragStart(event: DragStartEvent) {
    const { active } = event;
    if (active.data.current?.type === 'Column') {
      setActiveColumnId(active.id as string);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumnId(null);
    const { active, over } = event;

    if (!over) return; // Dragging over invalid element
    if (active.id === over.id) return; // Dropped in the same place so do nothing

    const activeIdx = columnIds.findIndex((colId) => colId === active.id);
    const overIdx = columnIds.findIndex((colId) => colId === over.id);

    const newOrder = arrayMove(columnIds, activeIdx, overIdx);
    dispatch(updateBoard({ id: boardId!, changes: { columnIds: newOrder } }));
  }
};

export default React.memo(BoardView);
