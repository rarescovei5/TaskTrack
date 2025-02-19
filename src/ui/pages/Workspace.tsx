import { useSelector } from 'react-redux';

import { RootState } from '../app/store';
import Navbar from '../layout/Navbar';
import Sidebar from '../layout/Workspace/Sidebar';
import Content from '../layout/Workspace/Content';
import { useParams } from 'react-router-dom';

const Workspace = () => {
  const appSettings = useSelector((state: RootState) => state.settings);
  const workspaceId = parseInt(useParams().workspaceId!, 10);

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      {!appSettings.isCollapsed && (
        <main className="flex flex-1 mt-6 gap-6 min-h-0">
          <Sidebar workspaceId={workspaceId} />
          <Content workspaceId={workspaceId} />
        </main>
      )}
    </div>
  );
};

export default Workspace;
