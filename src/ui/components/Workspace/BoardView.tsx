import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  changeCardTitle,
  changeToDoProperty,
  deleteCard,
  deleteToDo,
  moveToDo,
  newList,
  newToDo,
  saveWorkspaces,
  toggleCollapseCard,
  toggleToDoCompleted,
  updateCardsOrder,
} from '../../app/slices/workspacesSlice';
import AddIcon from '../icons/AddIcon';
import CheckIcon from '../icons/Check';
import CloseIcon from '../icons/Close';
import CollapseIcon from '../icons/Collapse';
import EditIcon from '../icons/Edit';
import { Card } from '../../types';

const EditableCardTitle = ({
  card,
  otherInfo,
}: {
  card: Card;
  otherInfo: { workspaceId: number; boardId: number; cardId: number };
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();
  const { workspaceId, boardId, cardId } = otherInfo;
  const [newListTitle, setNewListTitle] = useState('');

  const handleChangeTitle = () => {
    if (newListTitle.trim().length === 0) return;
    dispatch(
      changeCardTitle({ workspaceId, boardId, cardId, title: newListTitle })
    );
    dispatch(saveWorkspaces());
    setIsEditing(false);
  };

  return (
    <div className="mr-2">
      {!isEditing ? (
        <p
          className="w-full break-all py-1 border-[1px] border-transparent px-4 cursor-pointer rounded-2xl"
          onClick={() => {
            setIsEditing(true);
            setNewListTitle(card.title);
          }}
        >
          {card.title}
        </p>
      ) : (
        <input
          className="w-full p break-all outline-0 border-[1px] py-1 bg-white/10 border-white/10 px-4 rounded-2xl"
          type="text"
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
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

  //Focus
  const [isAddFocused, setIsAddFocused] = useState(false);
  const [isAddToDoFocused, setIsAddToDoFocused] = useState(-1);
  const [isEditOpen, setIsEditOpen] = useState('');
  //Inputs
  const [newListTitle, setNewListTitle] = useState('');
  const [newToDoTitle, setNewToDoTitle] = useState('');
  const [changeToDoTitle, setChangeToDoTitle] = useState('');

  // State for dragging
  const [draggedCard, setDraggedCard] = useState<number | null>(null);
  const [draggedTodo, setDraggedTodo] = useState<{
    fromCardId: number;
    todoIndex: number;
  } | null>(null);

  const handleCardDrop = (dropIndex: number) => {
    if (draggedCard === null || draggedCard === dropIndex) return;
    // Create a new array of cards and reorder
    const updatedCards = [...cards];
    const [removed] = updatedCards.splice(draggedCard, 1);
    updatedCards.splice(dropIndex, 0, removed);
    // Dispatch a new action to update the card order (make sure to implement updateCardsOrder in your slice)
    dispatch(
      updateCardsOrder({
        workspaceId,
        boardId: workspace.selectedMenu,
        newCards: updatedCards,
      })
    );
    dispatch(saveWorkspaces());
    setDraggedCard(null);
  };
  const handleDeleteCard = (cardId: number) => {
    dispatch(
      deleteCard({
        workspaceId,
        boardId: workspace.selectedMenu,
        cardId,
      })
    );
    dispatch(saveWorkspaces());
  };

  useEffect(() => {
    setIsAddFocused(false);
    setIsAddToDoFocused(-1);
    setIsEditOpen('');
  }, [draggedCard, draggedTodo]);

  return (
    <div className="flex-1 min-h-0 overflow-auto scrollbar-p">
      <div className="flex gap-4 items-start" id="cards-container">
        {/* Cards */}
        {cards.map((card, cardId) =>
          card.isCollapsed ? (
            <button
              id={`card-${cardId}`}
              className={`px-2 py-4 flex flex-col gap-4  items-center bg-slate-950/50 rounded-2xl cursor-pointer hover:bg-slate-950/25 transition-colors
                ${draggedCard === cardId && 'opacity-25'}`}
              onClick={() => cardCollapse(cardId)}
              key={cardId}
              draggable="true"
              onDragStart={() => {
                setDraggedCard(cardId);
              }}
              onDragOver={(e) => {
                // Prevent default to allow drop
                e.preventDefault();
              }}
              onDrop={(e) => {
                e.preventDefault();
                handleCardDrop(cardId);
              }}
              onDragEnd={() => {
                setDraggedCard(null);
              }}
            >
              <CollapseIcon classes="w-4 min-w-4" />
              <small className="write-vertical text-secondary">
                {card.content.length}
              </small>
              <p className="write-vertical">{card.title}</p>
            </button>
          ) : (
            <div
              id={`card-${cardId}`}
              draggable="true"
              onDragStart={() => {
                setDraggedCard(cardId);
              }}
              onDragOver={(e) => {
                // Prevent default to allow drop
                e.preventDefault();
              }}
              onDrop={(e) => {
                e.preventDefault();

                if (draggedTodo) {
                  dispatch(
                    moveToDo({
                      workspaceId,
                      boardId: workspace.selectedMenu,
                      fromCardId: draggedTodo.fromCardId,
                      toCardId: cardId,
                      fromTodoId: draggedTodo.todoIndex,
                      toTodoIndex: card.content.length,
                    })
                  );
                  dispatch(saveWorkspaces());
                  setDraggedTodo(null);
                } else {
                  handleCardDrop(cardId);
                }
              }}
              onDragEnd={() => {
                setDraggedCard(null);
              }}
              className={`min-w-60 max-w-100 bg-slate-950/75 flex flex-col gap-4 py-4 rounded-2xl ${
                draggedCard === cardId && 'opacity-25'
              }`}
              key={cardId}
            >
              {/* Card Header */}
              <div className="flex px-4 justify-between items-center">
                <EditableCardTitle
                  card={card}
                  otherInfo={{
                    workspaceId,
                    boardId: workspace.selectedMenu,
                    cardId,
                  }}
                />
                <div className="flex gap-2 pr-4">
                  <button
                    className="cursor-pointer w-6 aspect-square grid place-content-center border-[1px] border-transparent rounded-full hover:border-white/10"
                    onClick={() => cardCollapse(cardId)}
                  >
                    <CollapseIcon classes="w-4 min-w-4" />
                  </button>
                  <button
                    className="cursor-pointer w-6 aspect-square grid place-content-center border-[1px] border-transparent rounded-full hover:border-white/10"
                    onClick={() => {
                      handleDeleteCard(cardId);
                    }}
                  >
                    <CloseIcon classes="w-2 min-w-2" />
                  </button>
                </div>
              </div>
              {/* Card Content */}
              <div className="flex flex-col gap-2">
                {card.content.map((toDo, toDoId) =>
                  !(isEditOpen === `${cardId}${toDoId}`) ? (
                    <div
                      key={toDoId}
                      draggable="true"
                      onDragStart={(e) => {
                        e.stopPropagation();
                        setDraggedTodo({
                          fromCardId: cardId,
                          todoIndex: toDoId,
                        });
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (draggedTodo) {
                          // If dropping on a task, insert before the target task.
                          // If the task is dropped onto itself, do nothing.
                          if (
                            draggedTodo.fromCardId === cardId &&
                            draggedTodo.todoIndex === toDoId
                          )
                            return;
                          dispatch(
                            moveToDo({
                              workspaceId,
                              boardId: workspace.selectedMenu,
                              fromCardId: draggedTodo.fromCardId,
                              toCardId: cardId,
                              fromTodoId: draggedTodo.todoIndex,
                              toTodoIndex: toDoId,
                            })
                          );
                          dispatch(saveWorkspaces());
                          setDraggedTodo(null);
                        }
                      }}
                      onDragEnd={() => setDraggedTodo(null)}
                      className="rounded-2xl relative group bg-slate-800/50 px-4 py-2 mx-4 "
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
                          dispatch(saveWorkspaces());
                        }}
                      >
                        {toDo.isCompleted && (
                          <CheckIcon classes="min-w-2 w-2" />
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
                        <EditIcon classes="min-w-4 w-4" />
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
                    <div
                      key={toDoId}
                      className="w-full  rounded-2xl flex flex-col gap-2 px-4"
                    >
                      <input
                        className="w-full break-all px-4 py-2 rounded-2xl outline-0 border-[1px] border-transparent focus:border-white/50 bg-slate-800/50"
                        type="text"
                        defaultValue={changeToDoTitle}
                        onChange={(e) => setChangeToDoTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') changeToDoName(cardId, toDoId);
                        }}
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
              </div>
              {/* Add To Do Task */}
              <div>
                {isAddToDoFocused === cardId ? (
                  <div className="flex gap-2 flex-col">
                    <input
                      className=".p outline-0 border-transparent border-[1px] focus:border-white/50 mx-4 px-4 py-2 rounded-2xl bg-white/5"
                      type="text"
                      value={newToDoTitle}
                      onChange={(e) => setNewToDoTitle(e.target.value)}
                      placeholder="Enter a title or a link"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') createNewTodo(cardId);
                      }}
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
                        <CloseIcon classes="min-w-4 w-4 hover:scale-125 transition-transform" />
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
                    <AddIcon />
                    Add new card
                  </button>
                )}
              </div>
            </div>
          )
        )}

        {/* Add a new list */}
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
            <AddIcon classes="min-w-2 w-2" /> Add new list
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
                <CloseIcon classes="min-w-4 w-4 hover:scale-125 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardView;
