import { useDispatch } from 'react-redux';
import { TableViewProps } from '../../types';
import {
  changeToDoProperty,
  saveWorkspaces,
  toggleToDoCompleted,
} from '../../app/slices/workspacesSlice';
import CheckIcon from '../icons/Check';

const TableView = ({
  items,
  workspaceId,
}: {
  items: Record<string, TableViewProps[]>;
  workspaceId: number;
}) => {
  const dispatch = useDispatch();

  return (
    <div className="flex-1 min-h-0 overflow-auto scrollbar-p">
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex sticky top-0 z-10 py-4 w-full text-white">
          <p className="flex-[2]">Task</p>
          <p className="flex-1">List</p>
          <p className="flex-1">Labels</p>
          <p className="flex-1">Due Date</p>
        </div>

        <hr className="w-full h-0.5 rounded-full bg-white/50" />

        {/* Rows */}
        {Object.values(items)
          .flat()
          .map((task) => (
            <div
              key={`${task.boardId}-${task.listId}-${task.id}`}
              className="w-full"
            >
              <div className="flex">
                {/* Task Title */}
                <div className="group flex-[2] overflow-hidden transition-colors flex items-center hover:bg-white/10 relative">
                  {/* Checkbox Button */}
                  <button
                    className={`absolute left-2 cursor-pointer grid place-content-center w-4 transition-all duration-300 aspect-square border-[1px] border-white/50 rounded-full ${
                      task.isCompleted
                        ? 'bg-accent'
                        : 'opacity-0 group-hover:opacity-100'
                    }`}
                    onClick={() => {
                      dispatch(
                        toggleToDoCompleted({
                          workspaceId: workspaceId,
                          boardId: task.boardId,
                          cardId: task.listId,
                          todoId: task.id,
                        })
                      );
                    }}
                  >
                    {task.isCompleted && <CheckIcon classes="min-w-2 w-2" />}
                  </button>

                  <div
                    className={`transition-all py-2 duration-300 ${
                      task.isCompleted ? 'ml-8' : 'group-hover:ml-8'
                    }`}
                  >
                    <p className="break-all">{task.title}</p>
                  </div>
                </div>

                {/* List the task is in */}
                <div className="flex-1 flex items-center overflow-hidden transition-colors hover:bg-white/10">
                  <p className="py-2">{task.originList}</p>
                </div>

                {/* Labels of the task */}
                <div className="flex-1 overflow-hidden transition-colors hover:bg-white/10">
                  <p className="py-2">{task.labels.join(', ') || '-'}</p>
                </div>

                {/* Due Date of the task */}
                <div className="flex-1 flex items-center overflow-hidden transition-colors hover:bg-white/10">
                  {task.dueDate ? (
                    <input
                      type="date"
                      className="py-2 p outline-0 w-full"
                      value={task.dueDate.toISOString().split('T')[0]}
                      onChange={(e) => {
                        // Parse the new date string from the input
                        const newDate = new Date(e.target.value);
                        // Dispatch an action to update the due date (you can adjust it based on your state management)
                        dispatch(
                          changeToDoProperty({
                            workspaceId: workspaceId,
                            boardId: task.boardId,
                            cardId: task.listId,
                            todoId: task.id,
                            property: 'dueDate',
                            value: newDate,
                          })
                        );
                        dispatch(saveWorkspaces());
                      }}
                    />
                  ) : (
                    <button
                      className="py-2 w-full cursor-pointer"
                      onClick={() => {
                        // Parse the new date string from the input
                        const newDate = new Date(
                          new Date().getTime() + 7 * 24 * 60 * 60 * 1000
                        );
                        // Dispatch an action to update the due date (you can adjust it based on your state management)
                        dispatch(
                          changeToDoProperty({
                            workspaceId: workspaceId,
                            boardId: task.boardId,
                            cardId: task.listId,
                            todoId: task.id,
                            property: 'dueDate',
                            value: newDate,
                          })
                        );
                        dispatch(saveWorkspaces());
                      }}
                    >
                      <p className="text-left">-</p>
                    </button>
                  )}
                </div>
              </div>
              <hr className="w-full h-[1px] bg-white/25" />
            </div>
          ))}
      </div>
    </div>
  );
};

export default TableView;
