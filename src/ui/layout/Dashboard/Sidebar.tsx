import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useDispatch } from 'react-redux';
import { newWorkspace } from '../../app/slices/workspacesSlice';

const Sidebar = (props: {
  selectedMenu: number;
  setSelectedMenu: Function;
}) => {
  const workspaces = useSelector((state: RootState) => state.workspaces);
  const dispatch = useDispatch();

  const createNewWorkspace = () => {
    dispatch(newWorkspace());
  };
  const handleSelectMenu = (index: number) => {
    props.setSelectedMenu(index);
  };

  return (
    <div className="p-4 glass-card w-xs h-full text-white flex flex-col gap-4 select-none">
      <button
        className={`flex items-center gap-4 p-4 rounded-2xl ${
          props.selectedMenu === -1
            ? 'bg-slate-800/50'
            : 'cursor-pointer hover:bg-slate-800/50'
        }`}
        onClick={() => handleSelectMenu(-1)}
      >
        <img className="w-4 min-w-4" src="./template.svg" alt="" />
        <p>Templates</p>
      </button>
      <hr className="h-[1px] w-full bg-white opacity-50" />
      <div className="flex flex-col gap-2">
        <div className="flex justify-between px-4">
          <small className="text-secondary">Workspaces</small>
          <button
            className="cursor-pointer hover:scale-125 transition-all"
            onClick={createNewWorkspace}
          >
            <img src="Add.svg" alt="" />
          </button>
        </div>
        {workspaces.map((workspace, index) => (
          <button
            className={`p-4 rounded-2xl flex gap-2 items-center ${
              props.selectedMenu === index
                ? 'bg-slate-800/50'
                : 'hover:bg-slate-800/50 cursor-pointer'
            }`}
            key={index}
            onClick={() => handleSelectMenu(index)}
          >
            <div className="bg-accent w-4 h-4 rounded-2xl grid place-content-center">
              <small className="letter text-slate-950">
                {workspace.name.charAt(0)}
              </small>
            </div>
            <p>{workspace.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
