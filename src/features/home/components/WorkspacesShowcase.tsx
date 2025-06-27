import { useAppSelector } from '@/app/hooks';
import { selectAllWorkspaces } from '@/features/workspace/slices/workspacesSlice';
import { Plus } from 'lucide-react';
import React from 'react';
import CreateWorkspaceForm from './CreateWorkspaceForm';
import { Link } from 'react-router-dom';
import { fileToBase64 } from '@/lib/fileToBase64';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface WorkspaceProps {
  name: string;
  description: string | null;
  imageUrl: string;
  link: string;
}
const Workspace = (props: WorkspaceProps) => {
  const [imageSrc, setImageSrc] = React.useState<string>('null');

  React.useEffect(() => {
    const setupImage = async () => {
      if (props.imageUrl && props.imageUrl.charAt(1) === ':') {
        const imgBase64 = await fileToBase64(props.imageUrl);
        setImageSrc(imgBase64);
      } else {
        setImageSrc(props.imageUrl);
      }
    };
    setupImage();
  }, [props.imageUrl]);

  return (
    <Link
      to={props.link}
      className="flex flex-row items-center px-4 py-3 border border-border rounded-md gap-3 hover:bg-border/50 active:bg-border/25 transition-colors cursor-pointer"
    >
      <img className="w-12 h-12 rounded-md" src={imageSrc} alt={props.name} />
      <div className="flex flex-col overflow-hidden">
        <p className="font-medium truncate">{props.name}</p>
        <small className="text-muted truncate">
          {props.description || 'No Description'}
        </small>
      </div>
    </Link>
  );
};

type WorkspacesShowcaseProps = React.HTMLAttributes<HTMLDivElement> & {};
const WorkspacesShowcase = (props: WorkspacesShowcaseProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState<boolean>(false);
  const workspaces = useAppSelector(selectAllWorkspaces);

  return (
    <>
      <div {...props}>
        <h6 className="font-medium">Workspaces</h6>
        <hr className="border-border border-dashed" />
        <div
          style={{
            gridTemplateColumns: `repeat(auto-fill,minmax(350px,1fr))`,
            gridAutoRows: 'max-content',
          }}
          className="min-h-0 flex-1 gap-3 grid overflow-y-auto"
        >
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger className="flex flex-row items-center px-4 py-3 border border-border rounded-md gap-3 hover:bg-border/50 active:bg-border/25 transition-colors cursor-pointer">
              <div className="w-12 h-12 grid place-items-center bg-muted/5 rounded-md">
                <Plus size={16} />
              </div>
              <div className="text-left">
                <p className="font-medium">New Title</p>
                <small className="text-muted">New Description</small>
              </div>
            </DialogTrigger>
            <DialogContent className="rounded-md p-6 flex flex-col">
              {/* Header */}
              <DialogHeader>
                <DialogTitle>Create a New Workspace</DialogTitle>
                <DialogDescription>
                  Set up your new workspace by filling in the details below.
                </DialogDescription>
              </DialogHeader>

              {/* Form */}
              <CreateWorkspaceForm onOpenChange={setIsCreateDialogOpen} />
            </DialogContent>
          </Dialog>

          {workspaces.map((workspace) => (
            <Workspace
              key={workspace.id}
              name={workspace.name}
              description={workspace.description}
              imageUrl={workspace.imageUrl || 'https://picsum.photos/64/64'}
              link={`/workspaces/${workspace.id}/board`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default WorkspacesShowcase;
