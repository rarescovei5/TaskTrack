import React from 'react';
import { Task } from '../types';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAppDispatch } from '@/app/hooks';
import { updateTask } from '../slices/tasksSlice';

const TaskSettings = ({ task }: { task: Task }) => {
  const dispatch = useAppDispatch();
  const nameRef = React.useRef<HTMLHeadingElement>(null);

  const handleNameSave = () => {
    const newValue = nameRef.current?.textContent?.trim();
    if (newValue && newValue !== task.title) {
      dispatch(updateTask({ id: task.id, changes: { title: newValue } }));
    } else if (nameRef.current) {
      nameRef.current.textContent = task.title;
    }
  };

  const handleEditableKeyDown = (
    e: React.KeyboardEvent,
    ref: React.RefObject<HTMLDivElement | null>,
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
    </>
  );
};

export default TaskSettings;
