import { useAppSelector } from '@/app/hooks';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { selectCurrentUserId } from '@/features/auth/slices/authSlice';
import { selectAllTasks } from '@/features/workspace/slices/tasksSlice';
import { TaskPriority } from '@/features/workspace/types';
import { Clock12 } from 'lucide-react';
import React from 'react';

type HomeAssignedTasksProps = React.HTMLAttributes<HTMLDivElement> & {};
const HomeAssignedTasks = (props: HomeAssignedTasksProps) => {
  const [selectedOption, setSelectedOption] = React.useState<string>('Nearest Due Date');
  const userId = useAppSelector(selectCurrentUserId);

  const tasks = useAppSelector(selectAllTasks);
  const assignedTasks = React.useMemo(
    () =>
      tasks.filter((task) => task.assignees.some((asignee) => asignee.userId === userId)),
    [tasks]
  );

  return (
    <div {...props}>
      <div className="flex flex-row items-center justify-between">
        <h6 className="font-medium">Assigned Tasks</h6>
        <Select value={selectedOption} onValueChange={setSelectedOption}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="Nearest Due Date">Nearest Due Date</SelectItem>
            <SelectItem value="Due Date">Due Date</SelectItem>
            <SelectItem value="Priority">Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <hr className="border-border border-dashed" />
      <div
        style={{
          gridTemplateColumns: `repeat(auto-fill,minmax(350px,1fr))`,
          gridAutoRows: 'max-content',
        }}
        className="min-h-0 flex-1 gap-3 grid overflow-y-auto relative"
      >
        {assignedTasks
          .slice() // make a copy to avoid mutating redux state
          .sort((a, b) => {
            switch (selectedOption) {
              case 'Nearest Due Date':
                // Sort by soonest due date (closest in the future)
                if (!a.dueDate) return 1; // put tasks without due date last
                if (!b.dueDate) return -1;
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();

              case 'Due Date':
                // Sort by oldest due date first (same as Nearest Due Date)
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();

              case 'Priority':
                // Sort High priority first
                return b.priority - a.priority;

              default:
                return 0;
            }
          })
          .map((task) => (
            <div key={task.id} className="p-3 border rounded-md">
              <h6>{task.title}</h6>
              <p>Due: {task.dueDate || 'No due date'}</p>
              <p>Priority: {TaskPriority[task.priority]}</p>
            </div>
          ))}

        {assignedTasks.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <Clock12 size={48} className="mb-3" />
            <h6 className="font-semibold">No tasks assigned to you yet</h6>
            <small className="max-w-xs text-sm text-muted">
              Check back later or ask your team for updates.
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeAssignedTasks;
