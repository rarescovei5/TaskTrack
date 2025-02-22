import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toggleIsCollapsed } from '../app/slices/settingsSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { useEffect, useRef, useState } from 'react';
import AppLetterIcon from '../components/icons/AppLetterIcon';
import { saveWorkspaces, selectMenu } from '../app/slices/workspacesSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const appSettings = useSelector((state: RootState) => state.settings);
  const workspaces = useSelector((state: RootState) => state.workspaces);

  const lastHeight = useRef(window.innerHeight);

  const colors = {
    red: 'bg-red/50',
    blue: 'bg-blue/50',
    orange: 'bg-orange/50',
  };

  const [starredBoards, setStarredBoards] = useState<
    { workspaceId: number; boardId: number; title: string; color: string }[]
  >([]);
  const [isStarMenuOpen, setIsStarMenuOpen] = useState(false);

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

  const getBoardsWithStars = () => {
    const boards: {
      workspaceId: number;
      boardId: number;
      title: string;
      color: string;
    }[] = workspaces
      .map((workspace, wIdx) => {
        const boards = workspace.boards
          .filter((board) => board.isFavorite)
          .map((board, bIdx) => {
            return {
              workspaceId: wIdx,
              boardId: bIdx,
              title: board.title,
              color: board.bgColor,
            };
          });
        return boards;
      })
      .flat();
    setStarredBoards(boards);
  };

  useEffect(() => {
    getBoardsWithStars();
  }, [workspaces]);

  useEffect(() => {
    const hideStarMenu = (e: MouseEvent) => {
      if (e.target !== document.getElementById('star-menu'))
        setIsStarMenuOpen(false);
    };

    window.addEventListener('click', hideStarMenu);

    return () => {
      window.removeEventListener('click', hideStarMenu);
    };
  }, []);

  return (
    <nav className="glass-card flex px-8 py-4 text-white justify-between ">
      <div className="flex gap-8 items-center">
        <div className="flex items-center gap-4 button-no-drag">
          <AppLetterIcon classes="w-4" />
          <h6>SyncFlow</h6>
        </div>
        <hr className="h-full w-[1px] bg-white opacity-50 rounded-2xl" />
        <div className="flex gap-4 items-center">
          <Link
            className={`relative px-4 py-2 border-[1px]  rounded-2xl button-no-drag ${
              location.pathname === '/'
                ? 'border-white/10'
                : 'border-transparent hover:border-white/10'
            }`}
            to="/"
          >
            <p>Dashboard</p>
          </Link>
          <div className="relative">
            <button
              id="star-button"
              className={`px-4 py-2 flex items-center border-[1px]  rounded-2xl gap-2 cursor-pointer button-no-drag ${
                isStarMenuOpen
                  ? 'border-white/10'
                  : 'border-transparent hover:border-white/10'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setIsStarMenuOpen(!isStarMenuOpen);
              }}
            >
              <p id="star-button">Starred</p>
              <img
                id="star-button"
                className={`transition-all ease-in ${
                  isStarMenuOpen && 'rotate-180'
                }`}
                src="/Arrow.svg"
                alt=""
              />
            </button>
            {isStarMenuOpen && (
              <div
                className="absolute z-100 top-[calc(100%+8px)] left-0 w-xs p-4 glass-card"
                id="star-menu"
              >
                {starredBoards.length > 0 ? (
                  <div className="flex flex-col max-h-40 gap-2 overflow-y-auto">
                    {starredBoards.map((board, idx) => (
                      <button
                        key={idx}
                        className="flex items-center gap-4 cursor-pointer w-full py-2 button-no-drag border-[1px] border-transparent hover:border-white/10 rounded-2xl px-4"
                        onClick={() => {
                          dispatch(
                            selectMenu({
                              workspaceId: board.workspaceId,
                              menuId: board.boardId,
                            })
                          );
                          dispatch(saveWorkspaces());
                          setIsStarMenuOpen(false);
                          navigate(`/workspace/${board.workspaceId}`);
                        }}
                      >
                        <div
                          className={`w-4 h-4 rounded-full ${
                            colors[board.color as keyof typeof colors]
                          }`}
                        ></div>
                        <p>{board.title}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div>
                    <p className="text-center">
                      Star Important Boards to Access them Quickly
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
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
