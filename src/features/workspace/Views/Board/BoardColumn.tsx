import { colorMap, Column } from "../../types";
import { ChevronsRightLeft, Ellipsis, Plus } from "lucide-react";
import BoardTask, { DraggableTask } from "./BoardTask";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { createTaskForColumn } from "../../slices/tasksSlice";
import { ScrollArea, ScrollViewport } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ColumnSettings from "../../components/SettingsMenus/ColumnSettings";
import { selectColumnById } from "../../slices/columnsSlice";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

export const DraggableBoard = ({
  columnId,
  isInBoard,
}: {
  columnId: Column["id"];
  isInBoard?: boolean;
}) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: columnId,
    data: {
      type: "Column",
    },
  });

  const style = React.useMemo(
    () => ({
      transition,
      transform: CSS.Transform.toString(transform),
    }),
    [transition, transform]
  );

  const headerProps = React.useMemo(
    () => ({ ...listeners, ...attributes }),
    [listeners, attributes]
  );

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
      <BoardColumn
        columnId={columnId}
        headerProps={headerProps}
        isInBoard={isInBoard}
      />
    </div>
  );
};

type BoardColumnProps = {
  columnId: Column["id"];
  headerProps?: React.HTMLAttributes<HTMLDivElement>;
  isInBoard?: boolean;
};
const BoardColumn = React.memo(
  ({ columnId, headerProps, isInBoard }: BoardColumnProps) => {
    const dispatch = useAppDispatch();
    const column = useAppSelector((state) => selectColumnById(state, columnId));

    if (!column) return null;

    return (
      <>
        {/* Header/Handle */}
        <div
          {...headerProps}
          className={`flex justify-between items-center ${
            isInBoard ? "cursor-grab" : ""
          }`}
        >
          <div className="flex gap-2 items-center">
            <span className={`w-4 h-4 ${colorMap[column.color]} rounded-sm`} />
            <p>{column.name}</p>
          </div>
          <div className="flex gap-2 items-center">
            <ChevronsRightLeft size={16} className="cursor-pointer" />
            <Plus
              size={16}
              className="cursor-pointer"
              onClick={() =>
                dispatch(createTaskForColumn({ columnId: column.id }))
              }
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
            {isInBoard ? (
              <SortableContext
                items={column.taskIds}
                strategy={verticalListSortingStrategy}
              >
                {column.taskIds.map((taskId) => (
                  <DraggableTask key={taskId} taskId={taskId} />
                ))}
              </SortableContext>
            ) : (
              column.taskIds.map((taskId) => (
                <div
                  key={taskId}
                  className="flex flex-col gap-3 p-3 rounded-md bg-background"
                >
                  <BoardTask taskId={taskId} />
                </div>
              ))
            )}
          </ScrollViewport>
        </ScrollArea>
      </>
    );
  }
);
BoardColumn.displayName = "BoardColumn";

export default BoardColumn;
