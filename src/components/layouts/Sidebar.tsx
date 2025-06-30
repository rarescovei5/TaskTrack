import { Link, Route, Routes, useLocation } from 'react-router-dom';
import SidebarProfile from '../ui/SidebarProfile';
import SidebarButton from '../ui/SidebarButton';
import { Bell, House, Moon, Search, Sun } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import React from 'react';
import { flushSync } from 'react-dom';
import { setTheme } from '@/app/settings/settingsSlice';
import { ScrollArea } from '../shadcn/scroll-area';
import SidebarHomeButtons from './SidebarHomeButtons';
import SidebarWorkspaceButtons from './SidebarWorkspaceButtons';

const SidebarTop = () => {
  const location = useLocation();
  return (
    <>
      <SidebarProfile />
      <div className="flex flex-col gap-1">
        <SidebarButton
          className={`${
            location.pathname === '/'
              ? 'bg-border'
              : 'text-muted cursor-pointer hover:bg-border/50'
          }`}
          asChild
        >
          <Link to={'/'}>
            <House size={16} className="min-w-4" />
            <span>Home</span>
          </Link>
        </SidebarButton>
        <SidebarButton
          className={`text-muted cursor-pointer transition-colors duration-250 hover:bg-border/50 active:bg-border/25`}
        >
          <Search size={16} className="min-w-4" />
          <span>Search</span>
        </SidebarButton>
        <SidebarButton
          className={`text-muted cursor-pointer transition-colors duration-250 hover:bg-border/50 active:bg-border/25`}
        >
          <Bell size={16} className="min-w-4" />
          <span>Notifications</span>
        </SidebarButton>
      </div>
      <hr className="border-border border-dashed" />
    </>
  );
};

const SidebarMiddle = () => {
  return (
    <ScrollArea className="flex-1 flex flex-col gap-3 overflow-y-auto">
      <Routes>
        <Route path="/" Component={SidebarHomeButtons} />
        <Route path="/workspace/:workspaceId/*" Component={SidebarWorkspaceButtons} />
      </Routes>
    </ScrollArea>
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
        <Sun size={16} className="min-w-4 @[200px]:hidden" />
        <span className="@max-[200px]:hidden">Light</span>
      </div>
      <div
        className={` flex-1 flex flex-row justify-center items-center py-3 z-2 ${
          theme !== 'dark' && 'text-muted'
        }`}
      >
        <Moon size={16} className="min-w-4 @[200px]:hidden" />
        <span className="@max-[200px]:hidden">Dark</span>
      </div>
    </div>
  );
};

export { SidebarTop, SidebarMiddle, SidebarBottom };
