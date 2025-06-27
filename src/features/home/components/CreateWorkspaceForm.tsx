import React from 'react';
import { UploadCloud } from 'lucide-react';
import { open } from '@tauri-apps/plugin-dialog';
import { useAppDispatch } from '@/app/hooks';
import { createWorkspace } from '@/features/workspace/slices/workspacesSlice';

const CreateWorkspaceForm = ({
  onOpenChange,
}: {
  onOpenChange: (newOpen: boolean) => void;
}) => {
  const dispatch = useAppDispatch();

  const workspaceName = React.useRef<HTMLInputElement>(null);
  const workspaceDescription = React.useRef<HTMLTextAreaElement>(null);
  const [imagePath, setImagePath] = React.useState<string | null>(null);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImagePath(file.name);
    }
  };

  const handleClickUpload = async () => {
    const selected = await open({
      filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp'] }],
      multiple: false,
    });

    if (typeof selected === 'string') {
      setImagePath(selected);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = workspaceName.current?.value;
    const description = workspaceDescription.current?.value ?? null;

    if (name) {
      const payload = {
        name,
        description: description,
        imageUrl: imagePath,
      };

      dispatch(createWorkspace(payload));
      onOpenChange(false);
    } else {
      console.error('Workspace name is required');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="typography-small font-medium">Name</label>
        <input
          autoFocus
          type="text"
          ref={workspaceName}
          placeholder="e.g. Principium Studios"
          className="px-4 py-3 bg-muted/5 border border-border rounded-md outline-none"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="typography-small font-medium">Description</label>
        <textarea
          ref={workspaceDescription}
          placeholder="Optional. Describe the purpose of this workspace..."
          className="px-4 py-3 border border-border rounded-md bg-muted/5 resize-none min-h-[80px] outline-none"
        />
      </div>

      {/* Image Upload */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={handleClickUpload}
        className="border border-border text-muted border-dashed rounded-md px-4 py-3 flex flex-col items-center justify-center gap-3 bg-muted/5 hover:bg-muted/10 transition-colors cursor-pointer"
      >
        <UploadCloud size={24} />
        {imagePath ? (
          <small className="font-medium">{imagePath}</small>
        ) : (
          <small>Click or drag & drop an image here (optional)</small>
        )}
      </div>

      <button
        type="submit"
        className="bg-foreground text-background rounded-md py-2 px-4 font-medium typography-p hover:bg-foreground/90 transition-colors cursor-pointer"
      >
        Create Workspace
      </button>
    </form>
  );
};

export default CreateWorkspaceForm;
