import React from 'react';
import { Task, TaskPriority, TaskStatus } from '../../types';
import { Ellipsis, Flag, MessageCircle, User } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import TaskSettings from '../../components/SettingsMenus/TaskSettings';

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

const BoardTask = ({ task }: { task: Task }) => {
  return (
    <div className="flex flex-col gap-3 p-3 rounded-md bg-background">
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
      <div className="flex flex-col">
        <p className="font-medium">{task.title}</p>
        <small className="text-muted">{task.description ?? 'No Description'}</small>
      </div>
      <div className="flex justify-between items-center">
        <small className="text-muted">Assignees :</small>
        <div className="flex -gap-1">
          {task.assignees.length > 0 ? (
            task.assignees.map((asignee) =>
              asignee.profilePictureUrl ? (
                <img
                  src={asignee.profilePictureUrl}
                  className="rounded-full border-2 border-background"
                />
              ) : (
                <div className="w-full h-full bg-muted/5 flex items-center justify-center">
                  <User size={8} />
                </div>
              )
            )
          ) : (
            <small className="text-muted">None</small>
          )}
        </div>
      </div>
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
      <div className="flex items-center gap-1">
        <MessageCircle size={16} /> <small>{task.comments.length} Comments</small>
      </div>
    </div>
  );
};

export default BoardTask;
