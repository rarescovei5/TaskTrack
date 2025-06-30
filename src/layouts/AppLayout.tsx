import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/shadcn/resizable';
import { SidebarBottom, SidebarMiddle, SidebarTop } from '@/components/layouts/Sidebar';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <ResizablePanelGroup
      autoSaveId="AppLayout-PanelGroup"
      className="!h-svh !text-foreground"
      direction="horizontal"
    >
      <ResizablePanel
        className="p-3 flex flex-col gap-3 @container"
        minSize={20}
        defaultSize={20}
        maxSize={25}
      >
        <SidebarTop />
        <SidebarMiddle />
        <SidebarBottom />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <Outlet />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default AppLayout;
