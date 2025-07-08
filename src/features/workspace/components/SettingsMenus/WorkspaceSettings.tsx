import React from 'react';
import { Workspace } from '../../types';
import { useAppDispatch } from '@/app/hooks';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { updateWorkspace } from '../../slices/workspacesSlice';
import { Clock, Lock } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import DeleteDialog from '../DeleteDialog';

const WorkspaceSettings = ({ workspace }: { workspace: Workspace }) => {
  const dispatch = useAppDispatch();

  const nameRef = React.useRef<HTMLDivElement>(null);
  const descriptionRef = React.useRef<HTMLDivElement>(null);

  const finishEdit = (
    ref: React.RefObject<HTMLDivElement | null>,
    currentValue: string,
    onSave: (newValue: string) => void
  ) => {
    const newValue = ref.current?.textContent?.trim() || '';
    if (newValue && newValue !== currentValue) {
      onSave(newValue);
    } else {
      if (ref.current) {
        ref.current.textContent = currentValue;
      }
    }
  };

  const handleEditableKeyDown = (
    e: React.KeyboardEvent,
    ref: React.RefObject<HTMLDivElement | null>,
    currentValue: string
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
            onBlur={() =>
              finishEdit(nameRef, workspace.name, (newName) =>
                dispatch(
                  updateWorkspace({ id: workspace.id, changes: { name: newName } })
                )
              )
            }
            onKeyDown={(e) => handleEditableKeyDown(e, nameRef, workspace.name)}
            className="outline-none"
            ref={nameRef}
          >
            {workspace.name}
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
                const date = new Date(workspace.createdAt);
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
                  <Lock size={16} />
                  <p>Privacy</p>
                </>
              ),
              content: (
                <Checkbox
                  checked={workspace.isPublic}
                  onCheckedChange={(checked) =>
                    checked
                      ? dispatch(
                          updateWorkspace({
                            id: workspace.id,
                            changes: { isPublic: true },
                          })
                        )
                      : dispatch(
                          updateWorkspace({
                            id: workspace.id,
                            changes: { isPublic: false },
                          })
                        )
                  }
                />
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
      <div className="bg-muted/5 rounded-md px-4 py-2">
        <p className="mb-2">Workspace Description</p>
        <small
          className="text-muted outline-none"
          contentEditable
          suppressContentEditableWarning
          onBlur={() =>
            finishEdit(descriptionRef, workspace.description || '', (newDescription) =>
              dispatch(
                updateWorkspace({
                  id: workspace.id,
                  changes: { description: newDescription },
                })
              )
            )
          }
          onKeyDown={(e) =>
            handleEditableKeyDown(e, descriptionRef, workspace.description || '')
          }
          ref={descriptionRef}
        >
          {workspace.description || 'No Description'}
        </small>
      </div>
      <div className="flex-1 flex flex-col justify-end items-end">
        <DeleteDialog objectType="workspace" workspaceId={workspace.id} />
      </div>
    </>
  );
};

export default WorkspaceSettings;
