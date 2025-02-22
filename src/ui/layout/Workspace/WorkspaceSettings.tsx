import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  changeWorkspaceTitle,
  deleteWorkspace,
  saveWorkspaces,
} from '../../app/slices/workspacesSlice';
import { useNavigate } from 'react-router-dom';
import {
  makeWorkspaceTemplate,
  saveTemplates,
} from '../../app/slices/templatesSlice';

const WorkspaceSettings = ({ workspaceId }: { workspaceId: number }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const workspace = useSelector((state: RootState) => state.workspaces)[
    workspaceId
  ];
  const [newName, setNewName] = useState('');
  return (
    <div className="flex-1 gap-4 flex flex-col">
      <h6 className="px-4 py-2">Workspace Settings</h6>
      <hr className="h-[1px] w-full bg-white/50" />
      <div className="scrollbar-p flex flex-col gap-4 overflow-y-auto">
        <div className="flex flex-col max-w-xs">
          <h6>Workspace Name</h6>
          <input
            className="p-2 outline-0 rounded-2xl bg-slate-950/50 border-[1px] border-transparent focus:border-white/10"
            type="text"
            placeholder="New Name"
            value={newName}
            onFocus={() => setNewName(workspace.name)}
            onChange={(e) => {
              setNewName(e.target.value);
            }}
            onBlur={() => {
              if (newName.trim().length === 0) return;
              dispatch(changeWorkspaceTitle({ workspaceId, title: newName }));
              dispatch(saveWorkspaces());
              setNewName('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (newName.trim().length === 0) return;
                dispatch(changeWorkspaceTitle({ workspaceId, title: newName }));
                dispatch(saveWorkspaces());
                setNewName('');
                (e.target as HTMLInputElement).blur();
              }
            }}
          />
        </div>
        <div>
          <h6>Delete Workspace</h6>
          <button
            className="p-2 outline-0 rounded-2xl bg-red border-[1px] border-transparent cursor-pointer"
            onClick={() => {
              dispatch(deleteWorkspace(workspaceId));
              dispatch(saveWorkspaces());
              navigate('/');
            }}
          >
            Delete
          </button>
        </div>
        <div>
          <h6>Make Workspace a Template</h6>
          <button
            className="px-4 py-2 rounded-2xl cursor-pointer border-[1px] border-accent active:border-white/10 active:bg-accent"
            onClick={() => {
              dispatch(makeWorkspaceTemplate(workspace));
              dispatch(saveTemplates());
            }}
          >
            Make Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSettings;
