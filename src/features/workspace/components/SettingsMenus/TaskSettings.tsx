import React from 'react';
import { Task, TaskPriority, TaskStatus } from '../../types';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { updateTask } from '../../slices/tasksSlice';
import {
  CalendarDays,
  CalendarIcon,
  Clock,
  Flag,
  Info,
  Plus,
  Tag,
  User,
} from 'lucide-react';
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { selectWorkspaceById } from '../../slices/workspacesSlice';
import { useParams } from 'react-router-dom';

const TaskSettings = ({ task }: { task: Task }) => {
  const workspaceId = useParams().workspaceId!;
  const workspaceMembers = useAppSelector(
    (state) => selectWorkspaceById(state, workspaceId)?.members ?? []
  );

  const dispatch = useAppDispatch();
  const nameRef = React.useRef<HTMLHeadingElement>(null);
  const descriptionRef = React.useRef<HTMLElement>(null);
  const [dueDate, setDueDate] = React.useState<Date | undefined>(
    task.dueDate ? new Date(task.dueDate) : undefined
  );

  const [suggestionTags, setSuggestionTags] = React.useState<
    { value: string; id: string }[]
  >([]);

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

  const handleDescriptionFocus = () => {
    if (!task.description && descriptionRef.current) {
      descriptionRef.current.textContent = '';
    }
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
            content: (
              <>
                {task.tags.map((tag) => (
                  <div className="px-2 py-1 rounded-sm bg-muted/5">{tag}</div>
                ))}
                <Popover>
                  <PopoverTrigger className="p-1 rounded-md grid place-items-center bg-muted/5 border border-border cursor-pointer">
                    <Plus size={16} />
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search or create a tag..." />
                      <CommandList>
                        <CommandEmpty>
                          No match. <br />
                          <small className="text-muted">Press Enter to add.</small>
                        </CommandEmpty>
                        <CommandGroup>
                          {suggestionTags.map((suggestionTag) => (
                            <CommandItem
                              key={suggestionTag.id}
                              value={suggestionTag.value}
                              onSelect={() => {
                                dispatch(
                                  updateTask({
                                    id: task.id,
                                    changes: {
                                      tags: [...task.tags, suggestionTag.value],
                                    },
                                  })
                                );
                              }}
                            >
                              {suggestionTag.value}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </>
            ),
          },
          {
            label: (
              <>
                <User size={16} />
                <p>Assignees</p>
              </>
            ),
            contentCn: 'flex justify-between items-center',
            content: (
              <>
                <Popover>
                  <PopoverTrigger className="p-1 rounded-md grid place-items-center bg-muted/5 border border-border cursor-pointer">
                    <Plus size={16} />
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search a member..." />
                      <CommandList>
                        <CommandEmpty>No one found.</CommandEmpty>
                        <CommandGroup>
                          {workspaceMembers.map((member) => (
                            <CommandItem
                              key={member.userId}
                              value={`${member.userId}__${member.username}`}
                              onSelect={() => {
                                dispatch(
                                  updateTask({
                                    id: task.id,
                                    changes: {
                                      assignees: [...task.assignees, member],
                                    },
                                  })
                                );
                              }}
                            >
                              {member.username}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <div className="flex flex-wrap max-w-[calc(1.5rem*5)] sm:max-w-[calc(1.5rem*7)]  ">
                  {task.assignees.map((member, idx) =>
                    member.profilePictureUrl ? (
                      <img
                        key={idx}
                        src={member.profilePictureUrl}
                        className="rounded-full w-6 h-6 border-2 border-background bg-muted/5"
                      />
                    ) : (
                      <div className="w-6 h-6 border-2 border-background bg-muted/5 rounded-full grid place-items-center -ml-2">
                        <User size={12} />
                      </div>
                    )
                  )}
                </div>
              </>
            ),
          },
        ] as { label: React.ReactNode; contentCn?: string; content: React.ReactNode }[]
      ).map((field, idx) => (
        <div key={idx} className="flex items-center text-muted">
          <div className="flex-1 flex items-center gap-2">{field.label}</div>
          <div className={`flex-1 ${field.contentCn}`}>{field.content}</div>
        </div>
      ))}
      <div className="bg-muted/5 rounded-md px-4 py-2 min-h-24">
        <p className="mb-2">Task Description</p>
        <small
          className="text-muted outline-none block"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleDescriptionSave}
          onFocus={handleDescriptionFocus}
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
