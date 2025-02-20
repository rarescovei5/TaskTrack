import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useDispatch } from 'react-redux';
import {
  saveWorkspaces,
  toggleBoardFavourite,
} from '../../app/slices/workspacesSlice';
import { useState } from 'react';
import TableView from '../../components/Workspace/TableView';
import CalendarView from '../../components/Workspace/CalendarView';
import BoardView from '../../components/Workspace/BoardView';

const Content = ({ workspaceId }: { workspaceId: number }) => {
  const dispatch = useDispatch();
  const workspace = useSelector((state: RootState) => state.workspaces)[
    workspaceId
  ];

  const [selectedView, setSelectedView] = useState('Board');
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const handleFavourite = () => {
    dispatch(
      toggleBoardFavourite({ workspaceId, boardId: workspace.selectedMenu })
    );
    dispatch(saveWorkspaces());
  };

  switch (workspace.selectedMenu) {
    case -2:
      return (
        <div className="glass-card flex-1 min-h-0 text-white flex flex-col gap-4 p-4 select-none">
          <TableView />
        </div>
      );
    case -1:
      return (
        <div className="glass-card flex-1 min-h-0 text-white flex flex-col gap-4 p-4 select-none">
          <CalendarView />
        </div>
      );
    default:
      const board = workspace.boards[workspace.selectedMenu];
      return (
        <div className="glass-card flex-1 min-h-0 min-w-0 text-white flex flex-col gap-2 p-4 select-none">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <h6 className="px-4 py-2 cursor-pointer">{board.title}</h6>
              <button className="cursor-pointer" onClick={handleFavourite}>
                {board.isFavorite ? (
                  <img src="/StarFilled.svg" alt="" />
                ) : (
                  <img src="/Star.svg" alt="" />
                )}
              </button>
            </div>
            <div className="flex items-center gap-2">
              {board.views.map((view) => (
                <button
                  className={`px-4 py-2 cursor-pointer ${
                    selectedView === view
                      ? 'bg-accent rounded-2xl text-slate-950'
                      : ''
                  }`}
                  onClick={() => setSelectedView(view)}
                >
                  <p>{view}</p>
                </button>
              ))}
              <button
                className={`cursor-pointer h-10 aspect-square transition-colors border-[1px] border-transparent grid place-content-center rounded-2xl
                ${isDropDownOpen ? 'bg-white' : 'hover:border-white/50'}`}
                onClick={() => setIsDropDownOpen(!isDropDownOpen)}
              >
                <svg
                  width="8"
                  height="4"
                  viewBox="0 0 8 4"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.620998 0.105135L3.74418 3.17895C3.81233 3.24637 3.90431 3.28418 4.00017 3.28418C4.09603 3.28418 4.18801 3.24637 4.25616 3.17895L7.37934 0.105802C7.44791 0.0384221 7.5402 0.000666857 7.63633 0.000666857C7.73247 0.000666857 7.82475 0.0384221 7.89332 0.105802C7.92708 0.138718 7.95392 0.17806 7.97224 0.221508C7.99056 0.264957 8 0.311634 8 0.358787C8 0.405941 7.99056 0.452617 7.97224 0.496065C7.95392 0.539514 7.92708 0.578856 7.89332 0.611772L4.7708 3.68492C4.56513 3.88686 4.28841 4 4.00017 4C3.71193 4 3.43521 3.88686 3.22954 3.68492L0.107022 0.611772C0.073156 0.578845 0.0462357 0.539463 0.0278534 0.495952C0.00947115 0.452442 0 0.405687 0 0.358453C0 0.311219 0.00947115 0.264465 0.0278534 0.220955C0.0462357 0.177445 0.073156 0.138062 0.107022 0.105135C0.175589 0.0377553 0.267877 0 0.36401 0C0.460143 0 0.552431 0.0377553 0.620998 0.105135Z"
                    className={`transition-all ${
                      isDropDownOpen
                        ? 'fill-slate-950 rotate-180 origin-center'
                        : 'fill-white'
                    }`}
                  />
                </svg>
              </button>
            </div>
          </div>
          <hr className="min-h-[1px] h-[1px] w-full bg-white/50" />

          {selectedView === 'Board' && <BoardView workspaceId={workspaceId} />}
          {selectedView === 'Table' && <TableView />}
          {selectedView === 'Calendar' && <CalendarView />}
        </div>
      );
  }
};

export default Content;
