import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Board, Color, colors } from '../../types';
import { Clock, PaintBucket, Star, Trash } from 'lucide-react';
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppDispatch } from '@/app/hooks';
import { updateBoard } from '../../slices/boardsSlice';
import { Checkbox } from '@/components/ui/checkbox';
import DeleteDialog from '../DeleteDialog';

const BoardSettings = ({ board }: { board: Board }) => {
  const dispatch = useAppDispatch();

  const nameRef = React.useRef<HTMLDivElement>(null);
  const descriptionRef = React.useRef<HTMLDivElement>(null);

  const handleNameSave = () => {
    const newValue = nameRef.current?.textContent?.trim();
    if (newValue && newValue !== board.name) {
      dispatch(updateBoard({ id: board.id, changes: { name: newValue } }));
    } else if (nameRef.current) {
      nameRef.current.textContent = board.name;
    }
  };

  const handleDescriptionSave = () => {
    const raw = descriptionRef.current?.textContent?.trim();
    const newDesc = raw === '' ? null : raw;
    if (!newDesc && !board.description) {
      // If both null just rested placeholder
      if (!descriptionRef.current) return;
      descriptionRef.current.textContent = 'No Description';
    } else if (newDesc !== board.description) {
      // If change then apply
      dispatch(updateBoard({ id: board.id, changes: { description: newDesc } }));
    } else if (descriptionRef.current) {
      // If no change reset
      descriptionRef.current.textContent = board.description;
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
            onKeyDown={(e) => handleEditableKeyDown(e, nameRef, board.name)}
            className="outline-none"
            ref={nameRef}
          >
            {board.name}
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
                const date = new Date(board.createdAt);
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
                    value={board.color}
                    onValueChange={(newColor) =>
                      dispatch(
                        updateBoard({
                          id: board.id,
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
            {
              label: (
                <>
                  <Star size={16} />
                  <p>Starred</p>
                </>
              ),
              content: (
                <>
                  <Checkbox
                    checked={board.isStarred}
                    onCheckedChange={(checked) =>
                      checked
                        ? dispatch(
                            updateBoard({
                              id: board.id,
                              changes: { isStarred: true },
                            })
                          )
                        : dispatch(
                            updateBoard({
                              id: board.id,
                              changes: { isStarred: false },
                            })
                          )
                    }
                  />
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
      <div className="bg-muted/5 rounded-md px-4 py-2 mt-3 min-h-24">
        <p className="mb-2">Board Description</p>
        <small
          className="text-muted outline-none"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleDescriptionSave}
          onKeyDown={(e) => handleEditableKeyDown(e, descriptionRef, board.description)}
          ref={descriptionRef}
        >
          {board.description ?? 'No Description'}
        </small>
      </div>
      <div className="flex-1 flex flex-col justify-end items-end">
        <DeleteDialog
          objectType="board"
          workspaceId={board.workspaceId}
          boardId={board.id}
        />
      </div>

      {/* Boards don't have comments but saving this for later use */}
      {/* <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-3 flex-1 bg-muted/5 rounded-md px-3 py-2 min-w-0">
          <MessageCircle size={16} className="text-muted" />
          <input
            type="text"
            placeholder="Enter a new comment..."
            className="bg-transparent focus:outline-none placeholder:text-muted"
          />
        </div>
        <button
          className="px-4 py-2 rounded-md bg-primary text-white font-semibold hover:bg-primary/90 active:bg-primary/50 transition-colors duration-300 cursor-pointer"
          type="submit"
        >
          Send
        </button>
      </div> */}
    </>
  );
};
export default BoardSettings;
