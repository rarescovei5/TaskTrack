import { Plus } from 'lucide-react';
import React from 'react';

interface WorkspaceProps {
  name?: string;
  description?: string;
  imageUrl?: string;
}
const Workspace = (props: WorkspaceProps) => {
  return (
    <div className="flex flex-row items-center px-4 py-3 border border-border rounded-md gap-3 hover:bg-foreground/5 transition-colors cursor-pointer">
      <img className="w-12 h-12 rounded-md" src={props.imageUrl} alt={props.name} />
      <div>
        <p className="font-medium">{props.name}</p>
        <small className="text-muted">{props.description}</small>
      </div>
    </div>
  );
};

type HomeWorkspacesProps = React.HTMLAttributes<HTMLDivElement> & {};
const HomeWorkspaces = (props: HomeWorkspacesProps) => {
  return (
    <div {...props}>
      <div className="flex flex-row justify-between">
        <h6 className="font-medium">Workspaces</h6>
        <button className="cursor-pointer transition-colors text-muted hover:text-foreground active:text-foreground/75">
          <Plus size={16} />
        </button>
      </div>
      <hr className="border-border border-dashed" />
      <div className="min-h-0 flex-1 gap-3 flex flex-col overflow-y-auto">
        <Workspace
          name="Google Workspace"
          description="Description for Google Workspace"
          imageUrl="https://static.dezeen.com/uploads/2025/05/sq-google-g-logo-update_dezeen_2364_col_0-852x852.jpg"
        />
        <Workspace
          name="Workspace 2"
          description="Description for Workspace 2"
          imageUrl="/path/to/image2.jpg"
        />
        <Workspace
          name="Workspace 3"
          description="Description for Workspace 3"
          imageUrl="/path/to/image3.jpg"
        />
        <Workspace
          name="Workspace 3"
          description="Description for Workspace 3"
          imageUrl="/path/to/image3.jpg"
        />
        <Workspace
          name="Workspace 3"
          description="Description for Workspace 3"
          imageUrl="/path/to/image3.jpg"
        />
      </div>
    </div>
  );
};

export default HomeWorkspaces;
