import React from 'react';
import { colorMap, ColumnWithTasks } from '../types';
import { ChevronsRightLeft, Ellipsis, Plus } from 'lucide-react';
import BoardTask from './BoardTask';
import { useAppDispatch } from '@/app/hooks';
import { createTaskForColumn } from '../slices/tasksSlice';

const BoardColumn = ({ col }: { col: ColumnWithTasks }) => {
  const dispatch = useAppDispatch();
  return (
    <div className="h-full flex flex-col gap-4 px-4 py-3 bg-muted/5 rounded-md basis-1/3 shrink-0">
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
          <Ellipsis size={16} className="cursor-pointer" />
        </div>
      </div>
      {/* Tasks */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto min-h-0">
        {col.tasks.map((task, idx) => (
          <BoardTask key={idx} task={task} />
        ))}
      </div>
    </div>
  );
};

export default BoardColumn;
