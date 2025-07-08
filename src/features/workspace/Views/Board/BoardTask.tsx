import { Task, TaskPriority, TaskStatus } from '../../types';
import { Ellipsis, Flag, MessageCircle, User } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import TaskSettings from '../../components/SettingsMenus/TaskSettings';
import { useAppSelector } from '@/app/hooks';
import { selectTaskById } from '../../slices/tasksSlice';
import { useQueryCtx } from '../../components/context/QueryProvider';

export const TaskStatusComponent = ({ taskStatus }: { taskStatus: TaskStatus }) => {
  switch (taskStatus) {
    case TaskStatus.NotStarted:
      return (
        <small className="px-2 py-1 bg-primary/5 text-primary rounded-sm">
          Not Started
        </small>
      );
    case TaskStatus.InResearch:
      return (
        <small className="px-2 py-1 bg-chart-6/5 text-chart-6 rounded-sm">
          In Research
        </small>
      );
    case TaskStatus.OnTrack:
      return (
        <small className="px-2 py-1 bg-chart-4/5 text-chart-4 rounded-sm">On Track</small>
      );
    case TaskStatus.Completed:
      return (
        <small className="px-2 py-1 bg-chart-3/5 text-chart-3 rounded-sm">
          Completed
        </small>
      );
  }
};

export const TaskPriorityComponent = ({
  taskPriority,
}: {
  taskPriority: TaskPriority;
}) => {
  switch (taskPriority) {
    case TaskPriority.Low:
      return (
        <small className="px-2 py-1 bg-primary/5 text-primary rounded-sm">Low</small>
      );
    case TaskPriority.Medium:
      return (
        <small className="px-2 py-1 bg-chart-6/5 text-chart-6 rounded-sm">Medium</small>
      );
    case TaskPriority.High:
      return (
        <small className="px-2 py-1 bg-chart-4/5 text-chart-4 rounded-sm">High</small>
      );
  }
};

const BoardTask = ({ taskId }: { taskId: Task['id'] }) => {
  const task = useAppSelector((state) => selectTaskById(state, taskId));
  const { rgx } = useQueryCtx();

  if (!task) return null;

  if (!task.title.match(rgx)) return null;

  return (
    <div className="flex flex-col gap-3 p-3 rounded-md bg-background">
      {/* Status & Interaction Buttons */}
      <div className="flex justify-between items-center">
        <TaskStatusComponent taskStatus={task.status} />
        <Dialog>
          <DialogTrigger>
            <Ellipsis size={16} className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent
            className="top-4 bottom-4 right-4 translate-y-0 translate-x-0 flex flex-col gap-3 left-[unset]"
            aria-describedby={undefined}
          >
            <TaskSettings task={task} />
          </DialogContent>
        </Dialog>
      </div>
      {/* Name & Description */}
      <div className="flex flex-col overflow-hidden min-w-0 w-[90%]">
        <p className="font-medium truncate">{task.title}</p>
        <small className="text-muted truncate">
          {task.description ?? 'No Description'}
        </small>
      </div>
      {/* Asignees */}
      <div className="flex justify-between items-center">
        <small className="text-muted">Assignees :</small>
        <div className="flex flex-wrap">
          {task.assignees.length > 0 ? (
            task.assignees.map((asignee, idx) => {
              if (idx === 5) {
                const remaining = task.assignees.length - 5;
                return (
                  <div
                    key="more-indicator"
                    className="w-6 h-6 typography-small rounded-full grid place-items-center bg-muted/5 text-muted border-2 border-background -ml-2"
                  >
                    +{remaining}
                  </div>
                );
              } else if (idx > 5) {
                return null;
              } else {
                return asignee.profilePictureUrl ? (
                  <img
                    key={asignee.userId}
                    src={asignee.profilePictureUrl}
                    className="rounded-full w-6 h-6 border-2 border-background bg-muted/5"
                  />
                ) : (
                  <div className="w-6 h-6 border-2 border-background bg-muted/5 rounded-full grid place-items-center -ml-2">
                    <User size={12} />
                  </div>
                );
              }
            })
          ) : (
            <small className="text-muted">None</small>
          )}
        </div>
      </div>
      {/* Due Date */}
      <div className="flex justify-between items-center">
        <div className="flex gap-1 items-center text-muted">
          <Flag size={16} />{' '}
          <small>
            {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : 'No Due Date'}
          </small>
        </div>
        <TaskPriorityComponent taskPriority={task.priority} />
      </div>
      <hr className="border-border border-dashed" />
      {/* Comments */}
      <div className="flex items-center gap-1">
        <MessageCircle size={16} /> <small>{task.comments.length} Comments</small>
      </div>
    </div>
  );
};

export default BoardTask;
