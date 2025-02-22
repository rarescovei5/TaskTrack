import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useDispatch } from 'react-redux';
import {
  changeBoardProperty,
  saveWorkspaces,
  toggleBoardColor,
  toggleBoardFavourite,
} from '../../app/slices/workspacesSlice';
import { useState } from 'react';
import TableView from '../../components/Workspace/TableView';
import CalendarView from '../../components/Workspace/CalendarView';
import BoardView from '../../components/Workspace/BoardView';
import StarFilledIcon from '../../components/icons/StarFilled';
import StarIcon from '../../components/icons/Star';
import { TableViewProps } from '../../types';
import WorkspaceSettings from './WorkspaceSettings';
import ColorIcon from '../../components/icons/Color';
import PasteDarkIcon from '../../components/icons/PasteDarkIcon';
import {
  makeBoardTemplate,
  saveTemplates,
} from '../../app/slices/templatesSlice';

const EditableBoardTitle = ({
  title,
  otherInfo,
}: {
  title: string;
  otherInfo: { workspaceId: number; boardId: number };
}) => {
  const { workspaceId, boardId } = otherInfo;
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleChangeTitle = () => {
    if (newTitle.trim().length === 0) return;
    dispatch(
      changeBoardProperty({
        workspaceId,
        boardId,
        property: 'title',
        value: newTitle,
      })
    );
    dispatch(saveWorkspaces());
    setIsEditing(false);
  };

  return (
    <div className="mr-2">
      {!isEditing ? (
        <h6
          className="w-full break-all py-2 border-[1px] border-transparent px-4 cursor-pointer rounded-2xl"
          onClick={() => {
            setIsEditing(true);
            setNewTitle(title);
          }}
        >
          {title}
        </h6>
      ) : (
        <input
          className="w-full h6 break-all outline-0 border-[1px] py-2 bg-white/10 border-white/10 px-4 rounded-2xl"
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleChangeTitle();
          }}
          onBlur={handleChangeTitle} // Save on blur as well
          autoFocus
        />
      )}
    </div>
  );
};

const Content = ({ workspaceId }: { workspaceId: number }) => {
  const dispatch = useDispatch();
  const workspace = useSelector((state: RootState) => state.workspaces)[
    workspaceId
  ];

  const [selectedView, setSelectedView] = useState('Board');

  const handleFavourite = () => {
    dispatch(
      toggleBoardFavourite({ workspaceId, boardId: workspace.selectedMenu })
    );
    dispatch(saveWorkspaces());
  };

  const colors = {
    red: 'bg-red/50',
    blue: 'bg-blue/50',
    orange: 'bg-orange/50',
  };

  switch (workspace.selectedMenu) {
    case -3:
      return (
        <div className="scrollbar-p glass-card  flex-1 min-h-0 text-white flex flex-col gap-4 p-4 select-none ">
          <WorkspaceSettings workspaceId={workspaceId} />
        </div>
      );
    case -2:
      let allTasks: Record<string, TableViewProps[]> = {};

      workspace.boards.forEach((board, boardId) => {
        const toDos = board.cards.flatMap((card, listId) =>
          card.content.map((task, taskId) => ({
            ...task,
            originList: card.title, // Assign list name
            boardId, // Index of the board in workspace.boards
            listId, // Index of the card in board.cards
            id: taskId, // Index of the task in card.content
          }))
        );

        allTasks[board.title] = toDos; // Use board title as key
      });

      return (
        <div className="glass-card flex-1 min-h-0 text-white flex flex-col gap-4 p-4 select-none">
          <h6>Table</h6>
          <TableView items={allTasks} workspaceId={workspaceId} />
        </div>
      );
    case -1:
      const allItems: Record<string, TableViewProps[]> = {};

      workspace.boards.forEach((board, boardIndex) => {
        board.cards.forEach((card, cardIndex) => {
          // Convert each toDo into a TableViewProps item
          const tasks: TableViewProps[] = card.content.map(
            (todo, todoIndex) => ({
              ...todo,
              originList: card.title, // e.g., the name of the card
              boardId: boardIndex, // so you know which board it belongs to
              listId: cardIndex, // so you know which card it belongs to
              id: todoIndex, // the index of this toDo within the card
            })
          );

          // You can choose any unique key, e.g. card.title or a combination of board + card
          allItems[`${board.title} - ${card.title}`] = tasks;
        });
      });

      return (
        <div className="glass-card flex-1 min-h-0 text-white flex flex-col gap-4 p-4 select-none">
          <CalendarView items={allItems} workspaceId={workspaceId} />
        </div>
      );
    default:
      const board = workspace.boards[workspace.selectedMenu];
      return (
        <div className="glass-card flex-1 min-h-0 min-w-0 text-white flex flex-col gap-2 p-4 select-none">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <EditableBoardTitle
                title={board.title}
                otherInfo={{ workspaceId, boardId: workspace.selectedMenu }}
              />
              <button className="cursor-pointer" onClick={handleFavourite}>
                {board.isFavorite ? (
                  <StarFilledIcon classes="w-4 min-w-4" />
                ) : (
                  <StarIcon classes="w-4 min-w-4" />
                )}
              </button>
            </div>
            <div className="flex items-center gap-2">
              {board.views.map((view, idx) => (
                <button
                  className={`px-4 py-2 cursor-pointer ${
                    selectedView === view
                      ? 'bg-accent rounded-2xl text-slate-950'
                      : ''
                  }`}
                  onClick={() => setSelectedView(view)}
                  key={idx}
                >
                  <p>{view}</p>
                </button>
              ))}
            </div>
            <div className="ml-auto flex gap-2">
              <button
                className={`cursor-pointer  px-4 py-2  flex gap-2 rounded-2xl transition-all border-[1px] border-transparent duration-300 hover:border-white/10 ${
                  colors[board.bgColor]
                }`}
                onClick={() => {
                  dispatch(
                    toggleBoardColor({
                      workspaceId,
                      boardId: workspace.selectedMenu,
                    })
                  );
                  dispatch(saveWorkspaces());
                }}
              >
                <ColorIcon classes="w-4 min-w-4" />
                <p className="max-xl:hidden">Toggle Color</p>
              </button>
              <button
                className="cursor-pointer active:bg-accent/10  px-4 py-2  flex gap-2 rounded-2xl transition-all bg-accent text-slate-950 border-[1px] border-transparent duration-300 hover:border-white/10"
                onClick={() => {
                  dispatch(
                    makeBoardTemplate(workspace.boards[workspace.selectedMenu])
                  );
                  dispatch(saveTemplates());
                }}
              >
                <PasteDarkIcon classes="w-4 min-w-4" />
                <p className="max-xl:hidden">Make Template</p>
              </button>
            </div>
          </div>
          <hr className="min-h-[1px] h-[1px] w-full bg-white/50" />

          {selectedView === 'Board' && <BoardView workspaceId={workspaceId} />}
          {selectedView === 'Table' && (
            <TableView
              workspaceId={workspaceId}
              items={{
                [workspace.boards[workspace.selectedMenu].title]:
                  workspace.boards[workspace.selectedMenu].cards.flatMap(
                    (card, listId) =>
                      card.content.map((task, taskId) => ({
                        ...task,
                        originList: card.title,
                        boardId: workspace.selectedMenu,
                        listId: listId, // Index of the card in the board
                        id: taskId, // Index of the task in the card
                      }))
                  ),
              }}
            />
          )}
        </div>
      );
  }
};

export default Content;
