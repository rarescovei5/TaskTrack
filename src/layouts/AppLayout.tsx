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
import { flushSync } from 'react-dom';

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

  const ref = React.useRef<HTMLSpanElement>(null);

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
    await document.startViewTransition(() => {
      flushSync(() => {
        dispatch(setTheme({ newTheme }));
      });
    }).ready;

    const { top, left, width, height } = ref.current?.getBoundingClientRect()!;

    const right = window.innerWidth - left;
    const bottom = window.innerHeight - top;
    const maxRadius = Math.hypot(Math.max(left, right), Math.max(top, bottom));

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${left + width / 2}px ${top + height / 2}px)`,
          `circle(${maxRadius}px at ${left + width / 2}px ${top + height / 2}px)`,
        ],
      },
      {
        duration: 500,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      }
    );
  };

  return (
    <div
      className="relative flex flex-row ring ring-border rounded-md bg-border cursor-pointer"
      onClick={() => changeTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <span
        className={`absolute w-1/2 h-full bg-background rounded-md transition-[left] duration-500 ${
          theme === 'light' ? 'left-0' : 'left-1/2'
        }`}
        ref={ref}
      ></span>
      <div
        className={`flex-1 flex flex-row justify-center items-center gap-2 py-3 z-2 ${
          theme !== 'light' && 'text-muted'
        }`}
      >
        Light
      </div>
      <div
        className={` flex-1 flex flex-row justify-center items-center py-3 z-2 ${
          theme !== 'dark' && 'text-muted'
        }`}
      >
        Dark
      </div>
    </div>
  );
};

export default AppLayout;
