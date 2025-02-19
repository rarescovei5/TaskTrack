import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useDispatch } from 'react-redux';

const BoardView = ({ workspaceId }: { workspaceId: number }) => {
  const dispatch = useDispatch();
  const workspace = useSelector((state: RootState) => state.workspaces)[
    workspaceId
  ];
  const toDos = workspace.boards[workspace.selectedMenu].cards;

  return (
    <div className="flex-1 min-h-0 overflow-auto scrollbar-p">
      <div className="flex gap-4">
        {toDos.map((todo, idx) => (
          <div></div>
        ))}
      </div>
    </div>
  );
};

export default BoardView;
