import React from 'react';
import SidebarButton from '../ui/SidebarButton';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid } from 'lucide-react';

const SidebarWorkspaceButtons = () => {
  const location = useLocation();
  const workspaceId = '1';

  return (
    <div className="flex flex-col gap-1">
      <SidebarButton
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
      </SidebarButton>
    </div>
  );
};

export default SidebarWorkspaceButtons;
