import React from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/shadcn/resizable';
import SidebarProfile from '@/components/ui/SidebarProfile';
import SidebarButton from '@/components/ui/SidebarButton';
import { Link, useLocation } from 'react-router-dom';
import { Bell, House, Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setTheme } from '@/app/settings/settingsSlice';

const AppLayout = () => {
  return (
    <ResizablePanelGroup
      autoSaveId="AppLayout-PanelGroup"
      className="!h-svh !text-foreground"
      direction="horizontal"
    >
      <ResizablePanel
        className="p-3 flex flex-col gap-3"
        minSize={20}
        defaultSize={20}
        maxSize={25}
      >
        <SidebarProfile />
        <SidebarTop />
        <div className="flex-1 flex flex-col"></div>
        <SidebarBottom />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>Two</ResizablePanel>
    </ResizablePanelGroup>
  );
};

const SidebarTop = () => {
  const location = useLocation();
  return (
    <div className="flex flex-col gap-1">
      <SidebarButton
        className={`${
          location.pathname === '/' ? 'bg-border' : 'text-muted cursor-pointer'
        }`}
        asChild
      >
        <Link to={'/'}>
          <House size={16} />
          <span>Home</span>
        </Link>
      </SidebarButton>
      <SidebarButton className={`text-muted cursor-pointer`}>
        <Search size={16} />
        <span>Search</span>
      </SidebarButton>
      <SidebarButton className={`text-muted cursor-pointer`}>
        <Bell size={16} />
        <span>Notifications</span>
      </SidebarButton>
    </div>
  );
};

const SidebarBottom = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.settings.theme);

  React.useEffect(() => {
    switch (theme) {
      case 'light':
        document.documentElement.className = '';
        break;
      case 'dark':
        document.documentElement.className = 'dark';
        break;
    }
  }, [theme]);

  const changeTheme = async (newTheme: 'light' | 'dark') => {
    document.startViewTransition(() => {
      dispatch(setTheme({ newTheme }));
    }).ready;
  };

  return (
    <div className="flex flex-row">
      <div className="relative flex-1 flex flex-row ring ring-border rounded-md bg-border">
        <span className="absolute w-1/2 h-full bg-background rounded-md"></span>
        <span
          className="text-center flex-1 py-3 z-2 cursor-pointer"
          onClick={() => changeTheme('light')}
        >
          Light
        </span>
        <span
          className="text-center flex-1 py-3 z-2 cursor-pointer"
          onClick={() => changeTheme('dark')}
        >
          Dark
        </span>
      </div>
    </div>
  );
};

export default AppLayout;
