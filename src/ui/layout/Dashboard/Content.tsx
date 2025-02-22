import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useDispatch } from 'react-redux';
import {
  copyWorkspaceTemplate,
  newBoard,
  saveWorkspaces,
  selectMenu,
} from '../../app/slices/workspacesSlice';
import { useNavigate } from 'react-router-dom';
import AddIcon from '../../components/icons/AddIcon';
import CloseIcon from '../../components/icons/Close';
import {
  deleteWorksapceTemplate,
  saveTemplates,
} from '../../app/slices/templatesSlice';
import PasteIcon from '../../components/icons/PasteIcon';

const Content = (props: { selectedMenu: number }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const workspaces = useSelector((state: RootState) => state.workspaces);
  const templates = useSelector((state: RootState) => state.templates);

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
            <h6 className="mb-4">Templates</h6>
            <h6 className="text-secondary">Workspace Templates</h6>
            <div className="scrollbar-p mb-4 pr-4 grid gap-2 grid-cols-[repeat(auto-fill,minmax(250px,1fr))] max-h-100 overflow-y-auto">
              {templates.workspaces.map((workspace, idx) => (
                <div
                  className="p-4 bg-slate-800/50  relative rounded-2xl flex gap-2 border-[1px] border-transparent items-center"
                  key={idx}
                >
                  <div className="bg-accent w-4 h-4 rounded-2xl grid place-content-center">
                    <small className="letter text-slate-950">
                      {workspace.name.charAt(0)}
                    </small>
                  </div>
                  <p>{workspace.name}</p>
                  <div className="absolute right-4 flex gap-2">
                    <button
                      className="cursor-pointer p-2 border-[1px] border-transparent rounded-2xl hover:border-white/10"
                      onClick={() => {
                        dispatch(copyWorkspaceTemplate(workspace));
                        dispatch(saveWorkspaces());
                      }}
                    >
                      <PasteIcon classes="min-w-2 w-2" />
                    </button>
                    <button
                      className="cursor-pointer p-2 border-[1px] border-transparent rounded-2xl hover:border-white/10"
                      onClick={() => {
                        dispatch(deleteWorksapceTemplate(idx));
                        dispatch(saveTemplates());
                      }}
                    >
                      <CloseIcon classes="min-w-2 w-2" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <h6 className="text-secondary">Board Templates</h6>
            <div className="scrollbar-p pr-4 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] max-h-100 overflow-y-auto">
              {templates.boards.map((board, idx) => (
                <div></div>
              ))}
            </div>
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
              <AddIcon classes="w-4 min-w-4" />
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
