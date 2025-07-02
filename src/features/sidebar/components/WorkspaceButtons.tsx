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
            ? 'bg-border'
            : 'text-muted cursor-pointer hover:bg-border/50'
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
