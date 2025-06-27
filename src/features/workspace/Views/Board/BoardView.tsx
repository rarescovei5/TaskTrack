import { Column, Task, ViewProps } from "../../types";
import { Plus } from "lucide-react";
import { createColumnForBoard, updateColumn } from "../../slices/columnsSlice";
import { useAppDispatch } from "@/app/hooks";
import BoardColumn, { DraggableBoard } from "./BoardColumn";
import {
  ScrollArea,
  ScrollBar,
  ScrollViewport,
} from "@/components/ui/scroll-area";
import React from "react";

import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { updateBoard } from "../../slices/boardsSlice";
import { DraggableTask } from "./BoardTask";
import { store } from "@/app/store";
import { updateTask } from "../../slices/tasksSlice";

const BoardView = ({ boardId, isInBoard, columnIds }: ViewProps) => {
  const dispatch = useAppDispatch();

  const [activeColumnId, setActiveColumnId] = React.useState<
    Column["id"] | null
  >(null);
  const [activeTaskId, setActiveTaskId] = React.useState<Task["id"] | null>(
    null
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  return (
    <div className={`min-h-0 flex-1 relative ${isInBoard && "pr-12"}`}>
      {isInBoard ? (
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragMove={onDragMove}
        >
          <ScrollArea className="h-full w-full">
            <ScrollViewport className="[&>div]:!flex [&>div]:!gap-4 [&>div]:h-full [&>div]:pb-3">
              <SortableContext
                items={columnIds}
                strategy={horizontalListSortingStrategy}
              >
                {columnIds.map((columnId) => (
                  <DraggableBoard
                    key={columnId}
                    columnId={columnId}
                    isInBoard={isInBoard}
                  />
                ))}
              </SortableContext>
            </ScrollViewport>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {createPortal(
            <DragOverlay>
              {activeColumnId && (
                <DraggableBoard
                  key={activeColumnId}
                  columnId={activeColumnId}
                />
              )}
              {activeTaskId && (
                <DraggableTask key={activeTaskId} taskId={activeTaskId} />
              )}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      ) : (
        <ScrollArea className="h-full w-full">
          <ScrollViewport className="[&>div]:!flex [&>div]:!gap-4 [&>div]:h-full [&>div]:pb-3">
            {columnIds.map((columnId) => (
              <div className="h-full flex flex-col gap-4 min-w-0 px-4 py-3 bg-muted/5 rounded-md xl:basis-[calc((100%_-_2rem)/3)] lg:basis-[calc((100%_-_1rem)/2)] basis-full shrink-0">
                <BoardColumn
                  key={columnId}
                  columnId={columnId}
                  isInBoard={isInBoard}
                />
              </div>
            ))}
          </ScrollViewport>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}

      {isInBoard && (
        <div className="absolute right-0 top-0 rounded-md border border-border p-2 cursor-pointer">
          <Plus
            size={16}
            onClick={() => dispatch(createColumnForBoard({ boardId }))}
          />
        </div>
      )}
    </div>
  );

  // This handles setting the active column and task
  function onDragStart(event: DragStartEvent) {
    const { active } = event;
    if (active.data.current?.type === "Column") {
      setActiveColumnId(active.id as string);
      return;
    }
    if (active.data.current?.type === "Task") {
      setActiveTaskId(active.id as string);
      return;
    }
  }

  // This handles moving the active task in the same and a different column
  function onDragMove(event: DragMoveEvent) {
    const { active, over } = event;
    const storeState = store.getState();

    if (!active || !over) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeType !== "Task") return;

    // Dragging between tasks
    if (overType === "Task" && active.id !== over.id) {
      const activeTask = storeState.tasks.entities[active.id];
      const overTask = storeState.tasks.entities[over.id];
      const fromColumn = storeState.columns.entities[activeTask.columnId];
      const toColumn = storeState.columns.entities[overTask.columnId];

      if (!fromColumn || !toColumn) return;

      const activeTaskIdx = fromColumn.taskIds.findIndex(
        (taskId) => taskId === active.id
      );
      const overTaskIdx = toColumn.taskIds.findIndex(
        (taskId) => taskId === over.id
      );

      if (fromColumn.id === toColumn.id) {
        const newTaskIds = arrayMove(
          fromColumn.taskIds,
          // Move position of active task
          activeTaskIdx,
          // To position of over task
          overTaskIdx
        );

        dispatch(
          updateColumn({
            id: fromColumn.id,
            changes: { taskIds: newTaskIds },
          })
        );
      } else {
        const fromTaskIds = fromColumn.taskIds.filter(
          (taskId) => taskId !== active.id
        );
        const toTaskIds = [...toColumn.taskIds];
        toTaskIds.splice(overTaskIdx, 0, activeTask.id);
        dispatch(
          updateTask({
            id: activeTask.id,
            changes: { columnId: toColumn.id },
          })
        );
        dispatch(
          updateColumn({
            id: fromColumn.id,
            changes: { taskIds: fromTaskIds },
          })
        );
        dispatch(
          updateColumn({
            id: toColumn.id,
            changes: { taskIds: toTaskIds },
          })
        );
      }
    }
    // Dragging task into empty column
    else if (overType === "Column") {
      const activeTask = storeState.tasks.entities[active.id];
      const fromColumn = storeState.columns.entities[activeTask.columnId];
      const toColumn = storeState.columns.entities[over.id];

      if (!activeTask || !fromColumn || !toColumn || toColumn === fromColumn)
        return;

      // Remove from old column
      const updatedFromIds = fromColumn.taskIds.filter(
        (id) => id !== active.id
      );
      // Add to end of new column
      const updatedToIds = [...toColumn.taskIds, activeTask.id];

      dispatch(
        updateTask({
          id: activeTask.id,
          changes: { columnId: toColumn.id },
        })
      );
      dispatch(
        updateColumn({
          id: fromColumn.id,
          changes: { taskIds: updatedFromIds },
        })
      );
      dispatch(
        updateColumn({ id: toColumn.id, changes: { taskIds: updatedToIds } })
      );
    }
  }

  // This handles the sorting of columns
  function onDragEnd(event: DragEndEvent) {
    setActiveColumnId(null);
    setActiveTaskId(null);

    const { active, over } = event;

    if (
      active &&
      over &&
      active.id !== over.id &&
      active.data.current?.type === "Column" &&
      over.data.current?.type === "Column"
    ) {
      const activeIdx = columnIds.findIndex((colId) => colId === active.id);
      const overIdx = columnIds.findIndex((colId) => colId === over.id);

      const newOrder = arrayMove(columnIds, activeIdx, overIdx);
      dispatch(updateBoard({ id: boardId!, changes: { columnIds: newOrder } }));
    }
  }
};

export default React.memo(BoardView);
