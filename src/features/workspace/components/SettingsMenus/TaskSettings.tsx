import React from 'react';
import { Task, TaskPriority, TaskStatus } from '../../types';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAppDispatch } from '@/app/hooks';
import { updateTask } from '../../slices/tasksSlice';
import { CalendarDays, CalendarIcon, Clock, Flag, Info, Tag, User } from 'lucide-react';
import DeleteDialog from '../DeleteDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

const TaskSettings = ({ task }: { task: Task }) => {
  const dispatch = useAppDispatch();
  const nameRef = React.useRef<HTMLHeadingElement>(null);
  const descriptionRef = React.useRef<HTMLElement>(null);
  const [dueDate, setDueDate] = React.useState<Date | undefined>(
    task.dueDate ? new Date(task.dueDate) : undefined
  );

  const handleNameSave = () => {
    const newValue = nameRef.current?.textContent?.trim();
    if (newValue && newValue !== task.title) {
      dispatch(updateTask({ id: task.id, changes: { title: newValue } }));
    } else if (nameRef.current) {
      nameRef.current.textContent = task.title;
    }
  };

  const handleDescriptionSave = () => {
    const raw = descriptionRef.current?.textContent?.trim();
    const newDesc = raw === '' ? null : raw;
    if (!newDesc && !task.description) {
      // If both null just rested placeholder
      if (!descriptionRef.current) return;
      descriptionRef.current.textContent = 'No Description';
    } else if (newDesc !== task.description) {
      // If change then apply
      dispatch(updateTask({ id: task.id, changes: { description: newDesc } }));
    } else if (descriptionRef.current) {
      // If no change reset
      descriptionRef.current.textContent = task.description;
    }
  };

  const handleEditableKeyDown = (
    e: React.KeyboardEvent,
    ref: React.RefObject<HTMLElement | HTMLHeadingElement | null>,
    currentValue: string | null
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent newline
      ref.current?.blur(); // Will trigger finishEdit
    } else if (e.key === 'Escape') {
      if (ref.current) {
        ref.current.textContent = currentValue;
        ref.current.blur();
      }
    }
  };

  const handleDateChange = (newDate: Date | undefined) => {
    console.log(newDate);
    dispatch(
      updateTask({
        id: task.id,
        changes: {
          dueDate: newDate?.toISOString() ?? null,
        },
      })
    );
    setDueDate(newDate);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle asChild>
          <h6
            contentEditable
            suppressContentEditableWarning
            onBlur={handleNameSave}
            onKeyDown={(e) => handleEditableKeyDown(e, nameRef, task.title)}
            className="outline-none"
            ref={nameRef}
          >
            {task.title}
          </h6>
        </DialogTitle>
      </DialogHeader>
      <hr className="border-dashed border-border" />

      {(
        [
          {
            label: (
              <>
                <Clock size={16} />
                <p>Created Time</p>
              </>
            ),
            contentCn: 'flex items-center gap-2',
            content: (() => {
              const date = new Date(task.createdAt);
              const datePart = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });
              const timePart = date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              });
              return (
                <>
                  <p className="text-foreground mr-1">{datePart}</p>
                  <p>{timePart}</p>
                </>
              );
            })(),
          },
          {
            label: (
              <>
                <Info size={16} />
                <p>Status</p>
              </>
            ),
            content: (
              <Select
                defaultValue={TaskStatus[task.status]}
                onValueChange={(value) => {
                  // convert string back to enum if needed:
                  // e.g., updateTask({ ...task, status: TaskStatus[value as keyof typeof TaskStatus] });
                  console.log('Selected status:', value);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(TaskStatus)
                    .filter((key) => isNaN(Number(key)))
                    .map((key) => (
                      <SelectItem key={key} value={key}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            ),
          },
          {
            label: (
              <>
                <Flag size={16} />
                <p>Priority</p>
              </>
            ),
            content: (
              <Select
                defaultValue={TaskPriority[task.priority]}
                onValueChange={(value) => {
                  // convert string back to enum if needed
                  console.log('Selected priority:', value);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(TaskPriority)
                    .filter((key) => isNaN(Number(key)))
                    .map((key) => (
                      <SelectItem key={key} value={key}>
                        {key}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            ),
          },
          {
            label: (
              <>
                <CalendarDays size={16} />
                <p>Due Date</p>
              </>
            ),
            content: (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="text-sm px-3 py-2 border rounded-md flex gap-2 items-center min-w-36">
                    <CalendarIcon size={16} />
                    {dueDate ? dueDate.toLocaleDateString() : 'Select date'}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    defaultMonth={dueDate}
                    selected={dueDate}
                    onSelect={handleDateChange}
                    disabled={{
                      before: new Date(),
                    }}
                    className="rounded-md border shadow-sm"
                    required={false}
                  />
                </PopoverContent>
              </Popover>
            ),
          },
          {
            label: (
              <>
                <Tag size={16} />
                <p>Tags</p>
              </>
            ),
            content:
              task.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {task.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-muted text-sm rounded text-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No tags</p>
              ),
          },
          {
            label: (
              <>
                <User size={16} />
                <p>Assignees</p>
              </>
            ),
            content:
              task.assignees.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {task.assignees.map((member, idx) => (
                    <span
                      key={idx}
                      className="text-foreground text-sm bg-muted px-2 py-0.5 rounded"
                    >
                      {member.username}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted">Unassigned</p>
              ),
          },
        ] as { label: React.ReactNode; contentCn?: string; content: React.ReactNode }[]
      ).map((field, idx) => (
        <div key={idx} className="flex items-center text-muted">
          <div className="flex-1 flex items-center gap-2">{field.label}</div>
          <div className={`flex-1 ${field.contentCn}`}>{field.content}</div>
        </div>
      ))}
      <div className="bg-muted/5 rounded-md px-4 py-2">
        <p className="mb-2">Task Description</p>
        <small
          className="text-muted outline-none"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleDescriptionSave}
          onKeyDown={(e) =>
            handleEditableKeyDown(e, descriptionRef, task.description || '')
          }
          ref={descriptionRef}
        >
          {task.description || 'No Description'}
        </small>
      </div>
      <div className="flex-1 flex flex-col justify-end items-end">
        <DeleteDialog objectType="task" columnId={task.columnId} taskId={task.id} />
      </div>
    </>
  );
};

export default TaskSettings;
