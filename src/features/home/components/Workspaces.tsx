import { useAppSelector } from '@/app/hooks';
import { selectAllWorkspaces } from '@/features/workspace/slices/workspacesSlice';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Plug, Plus } from 'lucide-react';
import React from 'react';
import AddWorkspaceMenu from './AddWorkspaceMenu';
import { Link } from 'react-router-dom';
import { fileToBase64 } from '@/lib/fileToBase64';

interface WorkspaceProps {
  name: string;
  description: string | null;
  imageUrl: string;
  link: string;
}
const Workspace = (props: WorkspaceProps) => {
  const [imageSrc, setImageSrc] = React.useState<string>(props.imageUrl);

  React.useEffect(() => {
    if (props.imageUrl) {
      fileToBase64(props.imageUrl).then(setImageSrc);
    }
  }, [props.imageUrl]);

  return (
    <Link
      to={props.link}
      className="flex flex-row items-center px-4 py-3 border border-border rounded-md gap-3 hover:bg-border/50 active:bg-border/25 transition-colors cursor-pointer"
    >
      <img className="w-12 h-12 rounded-md" src={imageSrc} alt={props.name} />
      <div>
        <p className="font-medium">{props.name}</p>
        <small className="text-muted">{props.description}</small>
      </div>
    </Link>
  );
};

type HomeWorkspacesProps = React.HTMLAttributes<HTMLDivElement> & {};
const HomeWorkspaces = (props: HomeWorkspacesProps) => {
  const [isAddWorkspaceMenuOpen, setIsAddWorkspaceMenuOpen] = React.useState(false);
  const workspaces = useAppSelector(selectAllWorkspaces);

  return (
    <>
      {isAddWorkspaceMenuOpen && (
        <AddWorkspaceMenu close={() => setIsAddWorkspaceMenuOpen(false)} />
      )}
      <div {...props}>
        <div className="flex flex-row items-center justify-between">
          <h6 className="font-medium">Workspaces</h6>
          <div className="flex gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="cursor-pointer -mr-1 p-1 transition-colors text-muted hover:text-foreground active:text-foreground/75">
                  <Plug size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent>Direct Connect</TooltipContent>
            </Tooltip>
          </div>
        </div>
        <hr className="border-border border-dashed" />
        <div
          style={{
            gridTemplateColumns: `repeat(auto-fill,minmax(350px,1fr))`,
            gridAutoRows: 'max-content',
          }}
          className="min-h-0 flex-1 gap-3 grid overflow-y-auto"
        >
          <div
            onClick={() => setIsAddWorkspaceMenuOpen(true)}
            className="flex flex-row items-center px-4 py-3 border border-border rounded-md gap-3 hover:bg-border/50 active:bg-border/25 transition-colors cursor-pointer"
          >
            <div className="w-12 h-12 grid place-items-center bg-muted/5 rounded-md">
              <Plus size={16} />
            </div>
            <div>
              <p className="font-medium">New Title</p>
              <small className="text-muted">New Description</small>
            </div>
          </div>
          {workspaces.map((workspace) => (
            <Workspace
              key={workspace.id}
              name={workspace.name}
              description={workspace.description}
              imageUrl={workspace.imageUrl}
              link={`/workspace/${workspace.id}`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default HomeWorkspaces;
