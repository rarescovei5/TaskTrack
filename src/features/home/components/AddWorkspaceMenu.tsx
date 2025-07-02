import React from 'react';
import { Portal } from '@radix-ui/react-portal';
import { X, UploadCloud } from 'lucide-react';
import { open } from '@tauri-apps/plugin-dialog';
import { useAppDispatch } from '@/app/hooks';
import { createWorkspace } from '@/features/workspace/slices/workspacesSlice';

const AddWorkspaceMenu = ({ close }: { close: () => void }) => {
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
      setImagePath(selected); // or use full `selected` if you store the full path
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = workspaceName.current?.value;
    const description = workspaceDescription.current?.value ?? '';

    if (name) {
      const payload = {
        name,
        description,
        imageUrl: imagePath ?? 'https://picsum.photos/64/64',
      };

      dispatch(createWorkspace(payload));
      close();
    } else {
      console.error('Workspace name is required');
    }
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-border/25 backdrop-blur-sm text-foreground"
        onClick={close}
        onKeyDown={(e) => {
          if (e.key === 'Escape') close();
        }}
        role="dialog"
      >
        <div
          className="bg-background rounded-md p-6 border border-border w-full max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mb-5">
            <div className="flex items-center justify-between">
              <h6 className="font-semibold">Create a New Workspace</h6>
              <button
                onClick={close}
                className="text-muted hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <small className="text-muted mt-1">
              Set up your new workspace by filling in the details below.
            </small>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-1.5">
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

            <div className="grid gap-1.5">
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
        </div>
      </div>
    </Portal>
  );
};

export default AddWorkspaceMenu;
