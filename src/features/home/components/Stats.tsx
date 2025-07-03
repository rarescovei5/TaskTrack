import { useAppSelector } from '@/app/hooks';
import { selectCurrentUser } from '@/features/auth/slices/authSlice';
import { selectAllTasks } from '@/features/workspace/slices/tasksSlice';
import { TaskStatus } from '@/features/workspace/types';
import { cn } from '@/lib/utils';
import { ClipboardCheck, ClipboardList, NotebookPen } from 'lucide-react';
import React from 'react';

type StatPropsType = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  value: any;
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
};
const Stat = ({ title, value, className, icon, ...props }: StatPropsType) => {
  return (
    <div
      className={cn(
        'px-4 py-3 border border-border flex flex-row items-center gap-4 rounded-md',
        className
      )}
      {...props}
    >
      {React.cloneElement(icon, {
        className: cn(icon.props?.className, value === 0 ? 'text-muted' : ''),
      })}
      <div className="flex flex-col">
        <p className="text-muted">{title}</p>
        <h6 className={`font-medium ${value === 0 && 'text-muted'}`}>{value}</h6>
      </div>
    </div>
  );
};

const HomeStats = () => {
  const userId = useAppSelector(selectCurrentUser)!.id;
  const tasks = useAppSelector(selectAllTasks);

  // Stats
  const { totalTasks, assignedTasks, completedTasks } = React.useMemo(
    () => ({
      totalTasks: tasks.length,
      assignedTasks: tasks.filter((task) => task.assignees.includes(userId)).length,
      completedTasks: tasks.filter((task) => task.status === TaskStatus.Completed).length,
    }),
    [tasks]
  );

  return (
    <div className="rounded-md flex gap-3">
      <Stat
        className="flex-1"
        title="Total Tasks"
        value={totalTasks}
        icon={<ClipboardList size={32} />}
      />
      <Stat
        className="flex-1"
        title="Assigned Tasks"
        value={assignedTasks}
        icon={<NotebookPen size={32} />}
      />
      <Stat
        className="flex-1"
        title="Completed Tasks"
        value={completedTasks}
        icon={<ClipboardCheck size={32} />}
      />
    </div>
  );
};

export default HomeStats;
