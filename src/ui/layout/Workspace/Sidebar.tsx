import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { useState } from 'react';
import {
  deleteBoard,
  newBoard,
  saveWorkspaces,
  selectMenu,
} from '../../app/slices/workspacesSlice';

const Sidebar = ({ workspaceId }: { workspaceId: number }) => {
  const dispatch = useDispatch();
  const workspace = useSelector((state: RootState) => state.workspaces)[
    workspaceId
  ];
  const [isCollapsed, setIsCollapsed] = useState(false);

  const colors = {
    red: 'bg-red/50',
    blue: 'bg-blue/50',
    orange: 'bg-orange/50',
  };

  const createNewBoard = () => {
    dispatch(newBoard(workspaceId));
  };
  const handleSelectMenu = (id: number) => {
    dispatch(selectMenu({ workspaceId: workspaceId, menuId: id }));
    dispatch(saveWorkspaces());
  };
  const handleDeleteBoard = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number
  ) => {
    e.stopPropagation();
    if (workspace.selectedMenu === id) {
      dispatch(selectMenu({ workspaceId: workspaceId, menuId: -2 }));
    }
    dispatch(deleteBoard({ workspaceId: workspaceId, boardId: id }));
    dispatch(saveWorkspaces());
    console.log(workspace.selectedMenu, id);
  };

  return (
    <aside
      className={`w-xs h-full p-4 glass-card text-white flex flex-col gap-4 select-none ${
        isCollapsed ? 'hidden' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 grid place-content-center rounded-2xl bg-accent text-slate-950">
            <p>{workspace.name.charAt(0)}</p>
          </div>
          <div className="flex flex-col">
            <p>{workspace.name}</p>
            <small className="text-secondary">Individual</small>
          </div>
        </div>
        <button
          className="cursor-pointer"
          onClick={() => setIsCollapsed((prev) => !prev)}
        >
          <img
            className={isCollapsed ? 'rotate-270' : 'rotate-90'}
            src="/Arrow.svg"
            alt="Toggle sidebar"
          />
        </button>
      </div>
      <hr className="h-[1px] w-full min-h-[1px] bg-white opacity-50 rounded-2xl" />
      <div className="flex flex-1 flex-col gap-4 min-h-0">
        <div>
          <p className="mb-2">Workspace Views</p>
          <div className="flex flex-col gap-2">
            <button
              className={`flex border-[1px] border-transparent items-center gap-2 px-4 py-2 rounded-2xl ${
                workspace.selectedMenu === -2
                  ? 'bg-slate-800/50 border-white/50'
                  : 'hover:bg-slate-800/50 cursor-pointer'
              }`}
              onClick={() => handleSelectMenu(-2)}
            >
              <img src="/Table.svg" alt="Table view" />
              <p>Table</p>
            </button>
            <button
              className={`flex items-center border-[1px] border-transparent gap-2 px-4 py-2 rounded-2xl ${
                workspace.selectedMenu === -1
                  ? 'bg-slate-800/50 border-white/50'
                  : 'hover:bg-slate-800/50 cursor-pointer'
              }`}
              onClick={() => handleSelectMenu(-1)}
            >
              <img src="/Calendar.svg" alt="Calendar view" />
              <p>Calendar</p>
            </button>
          </div>
        </div>
        <div className="min-h-0 flex flex-col">
          <div className="flex mb-2 items-center justify-between">
            <p>Your Boards</p>
            <button
              className="cursor-pointer hover:scale-125 transition-transform"
              onClick={createNewBoard}
            >
              <img src="/Add.svg" alt="Add board" />
            </button>
          </div>
          <div className="scrollbar-p overflow-y-auto flex-1 min-h-0 flex flex-col gap-2">
            {workspace.boards.map((board, idx) => (
              <div
                className={`flex border-[1px] border-transparent items-center justify-between px-4 py-2 rounded-2xl  ${
                  workspace.selectedMenu === idx
                    ? 'bg-slate-800/50 border-white/50'
                    : 'hover:bg-slate-800/50 cursor-pointer'
                }`}
                onClick={() => handleSelectMenu(idx)}
                key={idx}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-4 w-4 rounded-sm grid place-content-center ${
                      colors[board.bgColor]
                    }`}
                  >
                    <small className="letter">{board.title.charAt(0)}</small>
                  </div>
                  <p className="break-all">{board.title}</p>
                </div>
                <button
                  className={`cursor-pointer ${
                    workspace.selectedMenu === idx ? '' : 'hidden'
                  }`}
                  onClick={(e) => handleDeleteBoard(e, idx)}
                >
                  <img className="w-2 min-w-2" src="/Close.svg" alt="" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
