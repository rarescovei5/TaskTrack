import { Link, useLocation, useParams } from 'react-router-dom';
import { LayoutGrid } from 'lucide-react';
import Button from './Button';

const WorkspaceButtons = () => {
  const workspaceId = useParams().workspaceId!;
  const location = useLocation();

  return (
    <div className="flex flex-col gap-1">
      <Button
        className={`${
          location.pathname === `/workspace/${workspaceId}`
            ? 'bg-muted/5'
            : 'text-muted cursor-pointer hover:bg-muted/4 active:bg-muted/2'
        }`}
        asChild
      >
        <Link to={`/workspace/${workspaceId}`}>
          <LayoutGrid size={16} className="min-w-4" />
          <span>Workspace</span>
        </Link>
      </Button>
    </div>
  );
};

export default WorkspaceButtons;
