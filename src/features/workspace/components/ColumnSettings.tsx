import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import React from 'react';
import { Color, colors, Column } from '../types';
import { useAppDispatch } from '@/app/hooks';
import { updateColumn } from '../slices/columnsSlice';
import { Clock, PaintBucket } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ColumnSettings = ({ column }: { column: Column }) => {
  const dispatch = useAppDispatch();
  const nameRef = React.useRef<HTMLHeadingElement>(null);

  const handleNameSave = () => {
    const newValue = nameRef.current?.textContent?.trim();
    if (newValue && newValue !== column.name) {
      dispatch(updateColumn({ id: column.id, changes: { name: newValue } }));
    } else if (nameRef.current) {
      nameRef.current.textContent = column.name;
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
            onKeyDown={(e) => handleEditableKeyDown(e, nameRef, column.name)}
            className="outline-none"
            ref={nameRef}
          >
            {column.name}
          </h6>
        </DialogTitle>
      </DialogHeader>
      <hr className="border-dashed border-border" />
      <div className="flex flex-col gap-4 text-muted">
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
                const date = new Date(column.createdAt);
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
                  <PaintBucket size={16} />
                  <p>Color</p>
                </>
              ),

              content: (
                <>
                  <Select
                    value={column.color}
                    onValueChange={(newColor) =>
                      dispatch(
                        updateColumn({
                          id: column.id,
                          changes: { color: newColor as Color },
                        })
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color} value={color}>
                          {color.charAt(0).toUpperCase() + color.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
      </div>
    </>
  );
};

export default ColumnSettings;
