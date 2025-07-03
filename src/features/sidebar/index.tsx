import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Profile from './components/Profile';
import Button from './components/Button';
import { Bell, House, Moon, Search, Sun } from 'lucide-react';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import React from 'react';
import { flushSync } from 'react-dom';
import { setTheme, ThemeType } from '@/app/settings/settingsSlice';
import HomeButtons from './components/HomeButtons';
import WorkspaceButtons from './components/WorkspaceButtons';
import SearchMenu from './components/SearchMenu';

const SidebarTop = () => {
  const location = useLocation();

  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  return (
    <>
      {isSearchOpen && <SearchMenu close={() => setIsSearchOpen(false)} />}
      <Profile />
      <div className="flex flex-col gap-2">
        <Button
          className={`${
            location.pathname === '/'
              ? 'bg-muted/5'
              : 'text-muted cursor-pointer hover:bg-muted/4 active:bg-muted/3'
          }`}
          asChild
        >
          <Link to={'/'}>
            <House size={16} className="min-w-4" />
            <span>Home</span>
          </Link>
        </Button>
        <Button
          className={`text-muted cursor-pointer transition-colors duration-250 hover:bg-muted/4 active:bg-muted/3`}
          onClick={() => setIsSearchOpen(true)}
        >
          <Search size={16} className="min-w-4" />
          <span>Search</span>
        </Button>

        <Button
          className={`text-muted cursor-pointer transition-colors duration-250 hover:bg-muted/4 active:bg-muted/3`}
        >
          <Bell size={16} className="min-w-4" />
          <span>Notifications</span>
        </Button>
      </div>
      <hr className="border-border border-dashed" />
    </>
  );
};

const SidebarMiddle = () => {
  return (
    <ScrollArea className="flex-1 flex flex-col gap-3 overflow-y-auto">
      <Routes>
        <Route path="/" Component={HomeButtons} />
        <Route path="/workspaces/:workspaceId/*" Component={WorkspaceButtons} />
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
      case ThemeType.Light:
        document.documentElement.className = '';
        break;
      case ThemeType.Dark:
        document.documentElement.className = 'dark';
        break;
    }
  }, [theme]);

  const changeTheme = async (newTheme: ThemeType) => {
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
      className="relative flex flex-row ring ring-muted/5 rounded-md bg-muted/5 cursor-pointer"
      onClick={() =>
        changeTheme(theme === ThemeType.Light ? ThemeType.Dark : ThemeType.Light)
      }
    >
      <span
        className={`absolute w-1/2 h-full bg-background rounded-md transition-[left] duration-500 ${
          theme === ThemeType.Light ? 'left-0' : 'left-1/2'
        }`}
        ref={ref}
      ></span>
      <div
        className={`flex-1 flex flex-row justify-center items-center gap-2 py-3 z-2 ${
          theme !== ThemeType.Light && 'text-muted'
        }`}
      >
        <Sun size={16} className="min-w-4 @[200px]:hidden" />
        <span className="@max-[200px]:hidden">Light</span>
      </div>
      <div
        className={` flex-1 flex flex-row justify-center items-center py-3 z-2 ${
          theme !== ThemeType.Dark && 'text-muted'
        }`}
      >
        <Moon size={16} className="min-w-4 @[200px]:hidden" />
        <span className="@max-[200px]:hidden">Dark</span>
      </div>
    </div>
  );
};

export { SidebarTop, SidebarMiddle, SidebarBottom };
