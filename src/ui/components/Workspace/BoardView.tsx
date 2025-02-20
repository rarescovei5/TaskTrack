import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import {
  changeToDoProperty,
  deleteToDo,
  newList,
  newToDo,
  saveWorkspaces,
  toggleCollapseCard,
  toggleToDoCompleted,
} from '../../app/slices/workspacesSlice';

const BoardView = ({ workspaceId }: { workspaceId: number }) => {
  const dispatch = useDispatch();
  const workspace = useSelector((state: RootState) => state.workspaces)[
    workspaceId
  ];
  const cards = workspace.boards[workspace.selectedMenu].cards;

  const createNewList = () => {
    if (newListTitle.length === 0) return;
    setNewListTitle('');
    dispatch(
      newList({
        workspaceId,
        boardId: workspace.selectedMenu,
        title: newListTitle,
      })
    );
    dispatch(saveWorkspaces());
  };
  const createNewTodo = (cardId: number) => {
    if (newToDoTitle.length === 0) return;
    setNewToDoTitle('');

    dispatch(
      newToDo({
        workspaceId,
        boardId: workspace.selectedMenu,
        cardId,
        title: newToDoTitle,
      })
    );
    dispatch(saveWorkspaces());
  };
  const cardCollapse = (listId: number) => {
    dispatch(
      toggleCollapseCard({
        workspaceId,
        boardId: workspace.selectedMenu,
        cardId: listId,
      })
    );
    dispatch(saveWorkspaces());
  };

  //Edit Todo Menu
  const changeToDoName = (cardId: number, todoId: number) => {
    if (changeToDoTitle.length === 0) return;
    setChangeToDoTitle('');
    setIsEditOpen('');
    dispatch(
      changeToDoProperty({
        workspaceId,
        boardId: workspace.selectedMenu,
        cardId,
        todoId,
        property: 'title',
        value: changeToDoTitle,
      })
    );
    dispatch(saveWorkspaces());
  };
  const archiveToDo = (cardId: number, todoId: number) => {
    setChangeToDoTitle('');
    setIsEditOpen('');
    dispatch(
      deleteToDo({
        workspaceId,
        boardId: workspace.selectedMenu,
        cardId,
        todoId,
      })
    );
    dispatch(saveWorkspaces());
  };

  /**
   * Variables for quality of life
   */

  //Focus
  const [isAddFocused, setIsAddFocused] = useState(false);
  const [isAddToDoFocused, setIsAddToDoFocused] = useState(-1);
  const [isEditOpen, setIsEditOpen] = useState('');
  //Inputs
  const [newListTitle, setNewListTitle] = useState('');
  const [newToDoTitle, setNewToDoTitle] = useState('');
  const [changeToDoTitle, setChangeToDoTitle] = useState('');

  return (
    <div className="flex-1 min-h-0 overflow-auto scrollbar-p">
      <div className="flex gap-4 items-start">
        {cards.map((card, cardId) =>
          card.isCollapsed ? (
            <button
              id={`card-${cardId}`}
              className="px-2 py-4 flex flex-col gap-4  items-center bg-slate-950/50 rounded-2xl cursor-pointer hover:bg-slate-950/25 transition-colors"
              onClick={() => cardCollapse(cardId)}
              key={cardId}
            >
              <img src="/Collapse.svg" alt="" />
              <small className="write-vertical text-secondary">
                {card.content.length}
              </small>
              <p className="write-vertical">{card.title}</p>
            </button>
          ) : (
            <div
              id={`card-${cardId}`}
              className="min-w-60 max-w-100 bg-slate-950/75 flex flex-col gap-4 py-4  rounded-2xl"
              key={cardId}
            >
              <div className="flex px-8 justify-between">
                <div>
                  <p>{card.title}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="cursor-pointer"
                    onClick={() => cardCollapse(cardId)}
                  >
                    <img src="/Collapse.svg" alt="" />
                  </button>
                  <button>
                    <img src="/More.svg" alt="" />
                  </button>
                </div>
              </div>
              {card.content.map((toDo, toDoId) =>
                !(isEditOpen === `${cardId}${toDoId}`) ? (
                  <div
                    key={toDoId}
                    className="rounded-2xl relative group bg-slate-800/50 px-4 py-2 mx-4"
                  >
                    <button
                      className={`absolute left-2 cursor-pointer grid place-content-center top-2 w-4 transition-all duration-300 aspect-square border-[1px] border-white/50 rounded-full ${
                        toDo.isCompleted
                          ? 'bg-accent'
                          : 'opacity-0 group-hover:opacity-100'
                      }`}
                      onClick={() => {
                        dispatch(
                          toggleToDoCompleted({
                            workspaceId,
                            boardId: workspace.selectedMenu,
                            cardId: cardId,
                            todoId: toDoId,
                          })
                        );
                      }}
                    >
                      {toDo.isCompleted && (
                        <img className="min-h-2 h-2" src="/Check.svg" />
                      )}
                    </button>
                    <button
                      className="cursor-pointer  opacity-0 group-hover:block group-hover:opacity-100 duration-300 transition-all absolute bg-slate-800/50 top-2 right-2"
                      onClick={() => {
                        setIsEditOpen(`${cardId}${toDoId}`);
                        setIsAddFocused(false);
                        setIsAddToDoFocused(-1);
                        setChangeToDoTitle(toDo.title);
                      }}
                    >
                      <img className="min-w-4 w-4" src="/Edit.svg" alt="" />
                    </button>
                    <div
                      className={`transition-all duration-300 ${
                        toDo.isCompleted ? 'ml-4' : 'group-hover:ml-4'
                      }`}
                    >
                      <p className="break-all">{toDo.title}</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full  rounded-2xl flex flex-col gap-2 px-4">
                    <input
                      className="w-full break-all px-4 py-2 rounded-2xl outline-0 border-[1px] border-transparent focus:border-white/50 bg-slate-800/50"
                      type="text"
                      defaultValue={changeToDoTitle}
                      onChange={(e) => setChangeToDoTitle(e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        className="px-4 py-2 bg-accent rounded-2xl cursor-pointer"
                        onClick={() => {
                          changeToDoName(cardId, toDoId);
                        }}
                      >
                        Save
                      </button>
                      <button
                        className="px-4 py-2 bg-red rounded-2xl cursor-pointer"
                        onClick={() => archiveToDo(cardId, toDoId)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              )}
              <div>
                {isAddToDoFocused === cardId ? (
                  <div className="flex gap-2 flex-col">
                    <input
                      className=".p outline-0 border-transparent border-[1px] focus:border-white/50 mx-4 px-4 py-2 rounded-2xl bg-white/5"
                      type="text"
                      value={newToDoTitle}
                      onChange={(e) => setNewToDoTitle(e.target.value)}
                      placeholder="Enter a title or a link"
                    />
                    <div className="flex gap-4 mx-4">
                      <button
                        className="bg-accent border-transparent border-[1px] hover:border-white/50 px-4 py-2 rounded-2xl cursor-pointer"
                        onClick={() => createNewTodo(cardId)}
                      >
                        Add Card
                      </button>
                      <button
                        className="cursor-pointer"
                        onClick={() => {
                          setIsAddToDoFocused(-1);
                          setIsEditOpen('');
                          setNewToDoTitle('');
                        }}
                      >
                        <img
                          className="min-w-4 w-4 hover:scale-125 transition-transform"
                          src="/Close.svg"
                          alt=""
                        />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="flex gap-2 w-full items-center cursor-pointer mx-4 px-4 py-2"
                    onClick={() => {
                      setIsAddToDoFocused(cardId);
                      setIsAddFocused(false);
                      setIsEditOpen('');
                    }}
                  >
                    <img src="/Add.svg" alt="" />
                    Add new card
                  </button>
                )}
              </div>
            </div>
          )
        )}
        <div className="min-w-60 max-w-100">
          <button
            className={`flex gap-2 w-full items-center cursor-pointer p-4 bg-slate-950/75 rounded-2xl ${
              isAddFocused && 'hidden'
            }`}
            onClick={() => {
              setIsAddFocused(true);
              setIsAddToDoFocused(-1);
            }}
          >
            <img src="/Add.svg" alt="" /> Add new list
          </button>
          <div
            className={`flex flex-col gap-4 bg-slate-950/75 p-4 rounded-2xl ${
              !isAddFocused && 'hidden'
            }`}
          >
            <input
              className=".p outline-0 border-transparent border-[1px] focus:border-white/50 px-4 py-2 rounded-2xl bg-white/5"
              type="text"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              placeholder="Enter list name"
            />
            <div className="flex gap-4">
              <button
                className="bg-accent border-transparent border-[1px] hover:border-white/50 px-4 py-2 rounded-2xl cursor-pointer"
                onClick={createNewList}
              >
                Add list
              </button>
              <button
                className="cursor-pointer"
                onClick={() => setIsAddFocused(false)}
              >
                <img
                  className="min-w-4 w-4 hover:scale-125 transition-transform"
                  src="/Close.svg"
                  alt=""
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardView;
