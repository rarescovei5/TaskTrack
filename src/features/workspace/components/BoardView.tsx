import React from 'react';
import { colorMap, ColumnWithTasks } from '../types';
import { Plus } from 'lucide-react';

const BoardView = ({
  isInBoard,
  columnsWithTasks,
  query,
}: {
  isInBoard: boolean;
  columnsWithTasks: ColumnWithTasks[];
  query: string;
}) => {
  return (
    <div className="flex-1 flex gap-4 relative">
      {columnsWithTasks.map((col, idx) => (
        <div key={idx} className="flex flex-col gap-3 px-4 py-3 bg-muted/5 rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <span className={`w-4 h-4 ${colorMap[col.color]}`} />
              <p>{col.name}</p>
            </div>
          </div>
        </div>
      ))}
      {isInBoard && (
        <div className="absolute right-0 top-0 rounded-md border border-border p-2">
          <Plus size={16} />
        </div>
      )}
    </div>
  );
};

export default BoardView;
