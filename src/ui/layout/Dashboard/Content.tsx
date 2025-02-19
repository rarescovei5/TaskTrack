import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useDispatch } from 'react-redux';
import {
  newBoard,
  saveWorkspaces,
  selectMenu,
} from '../../app/slices/workspacesSlice';
import { useNavigate } from 'react-router-dom';

const Content = (props: { selectedMenu: number }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const workspaces = useSelector((state: RootState) => state.workspaces);

  const colors = {
    red: 'bg-red/50',
    blue: 'bg-blue/50',
    orange: 'bg-orange/50',
  };

  const createNewBoard = () => {
    dispatch(newBoard(props.selectedMenu));
    dispatch(saveWorkspaces());
  };

  const navigateToBoard = (idx: number) => {
    dispatch(selectMenu({ workspaceId: props.selectedMenu, menuId: idx }));
    dispatch(saveWorkspaces());
    navigate(`/workspace/${props.selectedMenu}`);
  };

  return (
    <div className="glass-card flex-1 text-white min-h-0 flex flex-col py-4 pr-4 select-none">
      {props.selectedMenu === -1 ? (
        <>
          <div className="px-4">
            <h6>Workspace Templates</h6>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between pl-4 mb-4">
            <h6>Boards</h6>
            <button
              className="hover:scale-125 cursor-pointer"
              onClick={createNewBoard}
            >
              <img className="w-4 min-w-4" src="./Add.svg" alt="Add board" />
            </button>
          </div>
          <div className="overflow-y-auto scrollbar-p px-4 py-2 pr-4 flex-1 min-h-0">
            <div className="grid  grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
              {workspaces[props.selectedMenu].boards.map((board, idx) => (
                <button
                  key={idx}
                  onClick={() => navigateToBoard(idx)}
                  className={`cursor-pointer break-all min-h-60 border border-transparent hover:border-white/10 transition-transform duration-200 transform hover:scale-101 text-center rounded-2xl ${
                    colors[board.bgColor]
                  } p-4`}
                >
                  {board.title}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Content;
