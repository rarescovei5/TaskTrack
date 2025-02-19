import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toggleIsCollapsed } from '../app/slices/settingsSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { useRef } from 'react';

const Navbar = () => {
  const appSettings = useSelector((state: RootState) => state.settings);
  const location = useLocation();
  const dispatch = useDispatch();
  const lastHeight = useRef(window.innerHeight);

  const quitApp = () => {
    // @ts-ignore
    window.api.close();
  };
  const minimizeApp = () => {
    // @ts-ignore
    window.api.minimize();
  };
  const minimizeMain = () => {
    const nav = document.querySelector('nav')!;

    let newHeight: number;
    if (appSettings.isCollapsed) {
      newHeight = lastHeight.current;
    } else {
      lastHeight.current = window.innerHeight;
      newHeight = nav?.clientHeight;
    }

    dispatch(toggleIsCollapsed());

    //@ts-ignore
    window.api.resizeContent(newHeight);
  };

  return (
    <nav className="glass-card flex px-8 py-4 text-white justify-between ">
      <div className="flex gap-8 items-center">
        <div className="flex items-center gap-4 button-no-drag">
          <img className="w-4" src="/appLetter.svg" alt="" />
          <h6>SyncFlow</h6>
        </div>
        <hr className="h-full w-[1px] bg-white opacity-50" />
        <div className="flex gap-4 items-center">
          <Link
            className={`relative px-4 py-2 button-no-drag ${
              location.pathname !== '/'
                ? "before:absolute before:bottom-0 before:left-1/2 before:translate-x-[-50%] before:transition-all before:h-[1px] before:w-0 before:bg-accent hover:before:w-full before:content-['']"
                : "before:absolute before:bottom-0 before:left-0 before:h-[1px] before:w-full before:bg-accent before:content-['']"
            }`}
            to="/"
          >
            <p>Dashboard</p>
          </Link>
          <button className="px-4 py-2 flex items-center gap-2 cursor-pointer group button-no-drag">
            <p>Starred</p>
            <img
              className="transition-all ease-in group-hover:translate-x-1"
              src="/Arrow.svg"
              alt=""
            />
          </button>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <button
          className="w-4 h-4 bg-accent rounded-full cursor-pointer hover:scale-125 transition-transform button-no-drag"
          onClick={minimizeApp}
        ></button>
        <button
          className="w-4 h-4 bg-orange rounded-full cursor-pointer hover:scale-125 transition-transform button-no-drag"
          onClick={minimizeMain}
        ></button>
        <button
          className="w-4 h-4 bg-red rounded-full cursor-pointer hover:scale-125 transition-transform button-no-drag"
          onClick={quitApp}
        ></button>
      </div>
    </nav>
  );
};

export default Navbar;
