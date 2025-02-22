import { createSlice } from '@reduxjs/toolkit';
import { Card, Workspace } from '../../types';

const loadState = (): Array<Workspace> => {
  try {
    const data = localStorage.getItem('workspaces');
    if (!data) return [];

    const parsedData: Array<Workspace> = JSON.parse(data);

    // Convert dueDate and createdDate back to Date objects
    parsedData.forEach((workspace) => {
      workspace.boards.forEach((board) => {
        board.cards.forEach((card) => {
          card.content.forEach((todo) => {
            if (todo.dueDate) {
              todo.dueDate = new Date(todo.dueDate); // Convert back to Date object
            }
            if (todo.createdDate) {
              todo.createdDate = new Date(todo.createdDate); // Convert back to Date object
            }
          });
        });
      });
    });

    return parsedData;
  } catch (error) {
    console.error('Error parsing workspaces from localStorage', error);
    return [];
  }
};

const initialState: Array<Workspace> = loadState();

const workspacesSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {
    saveWorkspaces: (state) => {
      localStorage.setItem('workspaces', JSON.stringify(state));
    },

    /**
     *  Add new Stuff
     */
    newWorkspace: (state) => {
      state.push({
        name: `Workspace ${state.length + 1}`,
        settings: {},
        boards: [],
        selectedMenu: -1,
      });
    },
    newBoard: (state, { payload }: { payload: number }) => {
      const colors: Array<'red' | 'blue' | 'orange'> = [
        'red',
        'blue',
        'orange',
      ];
      const randomColor = Math.floor(Math.random() * 3);

      state[payload].boards.push({
        title: `Board ${state[payload].boards.length + 1}`,
        views: ['Board', 'Table'],
        cards: [],
        bgColor: colors[randomColor],
        isFavorite: false,
      });
    },
    newList: (
      state,
      {
        payload,
      }: { payload: { workspaceId: number; boardId: number; title: string } }
    ) => {
      state[payload.workspaceId].boards[payload.boardId].cards.push({
        title: payload.title,
        content: [],
        isCollapsed: false,
      });
    },
    newToDo: (
      state,
      {
        payload,
      }: {
        payload: {
          workspaceId: number;
          boardId: number;
          cardId: number;
          title: string;
        };
      }
    ) => {
      state[payload.workspaceId].boards[payload.boardId].cards[
        payload.cardId
      ].content.push({
        title: payload.title,
        description: '',
        isCompleted: false,
        priority: 'Low',
        labels: [],
        dueDate: null,
        createdDate: new Date(),
      });
    },
    copyWorkspaceTemplate: (state, { payload }: { payload: Workspace }) => {
      state.push(payload);
    },
    /**
     *  Delete Stuff
     */
    deleteWorkspace: (state, { payload }: { payload: number }) => {
      state.splice(payload, 1);
    },
    deleteBoard: (
      state,
      { payload }: { payload: { workspaceId: number; boardId: number } }
    ) => {
      state[payload.workspaceId].boards.splice(payload.boardId, 1);
    },
    deleteCard: (
      state,
      {
        payload,
      }: { payload: { workspaceId: number; boardId: number; cardId: number } }
    ) => {
      state[payload.workspaceId].boards[payload.boardId].cards.splice(
        payload.cardId,
        1
      );
    },
    deleteToDo: (
      state,
      {
        payload,
      }: {
        payload: {
          workspaceId: number;
          boardId: number;
          cardId: number;
          todoId: number;
        };
      }
    ) => {
      state[payload.workspaceId].boards[payload.boardId].cards[
        payload.cardId
      ].content.splice(payload.todoId, 1);
    },

    /**
     * Change stuff
     */
    changeToDoProperty: (
      state,
      {
        payload,
      }: {
        payload: {
          workspaceId: number;
          boardId: number;
          cardId: number;
          todoId: number;
          property:
            | 'title'
            | 'description'
            | 'priority'
            | 'labels'
            | 'priority'
            | 'dueDate';
          value: any;
        };
      }
    ) => {
      switch (payload.property) {
        case 'title':
          state[payload.workspaceId].boards[payload.boardId].cards[
            payload.cardId
          ].content[payload.todoId].title = payload.value;
          break;
        case 'description':
          state[payload.workspaceId].boards[payload.boardId].cards[
            payload.cardId
          ].content[payload.todoId].description = payload.value;
          break;
        case 'priority':
          state[payload.workspaceId].boards[payload.boardId].cards[
            payload.cardId
          ].content[payload.todoId].priority = payload.value;
          break;
        case 'labels':
          state[payload.workspaceId].boards[payload.boardId].cards[
            payload.cardId
          ].content[payload.todoId].labels = payload.value;
          break;
        case 'dueDate':
          state[payload.workspaceId].boards[payload.boardId].cards[
            payload.cardId
          ].content[payload.todoId].dueDate = payload.value;
          break;
      }
    },
    changeWorkspaceTitle: (
      state,
      {
        payload,
      }: {
        payload: {
          workspaceId: number;
          title: string;
        };
      }
    ) => {
      state[payload.workspaceId].name = payload.title;
    },
    changeCardTitle: (
      state,
      {
        payload,
      }: {
        payload: {
          workspaceId: number;
          boardId: number;
          cardId: number;
          title: string;
        };
      }
    ) => {
      state[payload.workspaceId].boards[payload.boardId].cards[
        payload.cardId
      ].title = payload.title;
    },
    updateCardsOrder: (
      state,
      {
        payload,
      }: {
        payload: {
          workspaceId: number;
          boardId: number;
          newCards: Array<Card>;
        };
      }
    ) => {
      state[payload.workspaceId].boards[payload.boardId].cards =
        payload.newCards;
    },
    moveToDo: (
      state,
      {
        payload,
      }: {
        payload: {
          workspaceId: number;
          boardId: number;
          fromCardId: number;
          toCardId: number;
          fromTodoId: number;
          toTodoIndex: number;
        };
      }
    ) => {
      const board = state[payload.workspaceId].boards[payload.boardId];
      const fromCard = board.cards[payload.fromCardId];
      const toCard = board.cards[payload.toCardId];

      if (!fromCard || !toCard) return; // Prevents errors if the card doesn't exist

      // Remove the task from the original card
      const [movedTodo] = fromCard.content.splice(payload.fromTodoId, 1);
      if (!movedTodo) return; // Prevent moving a nonexistent task

      // Insert into the new position on the target card
      toCard.content.splice(payload.toTodoIndex, 0, { ...movedTodo }); // Clone to avoid reference issues
    },
    changeBoardProperty: (
      state,
      {
        payload,
      }: {
        payload: {
          workspaceId: number;
          boardId: number;
          property: 'title' | 'bgColor';
          value: any;
        };
      }
    ) => {
      state[payload.workspaceId].boards[payload.boardId][payload.property] =
        payload.value;
    },

    /**
     *  Quality of life stuff
     */
    selectMenu(
      state,
      { payload }: { payload: { workspaceId: number; menuId: number } }
    ) {
      state[payload.workspaceId].selectedMenu = payload.menuId;
    },

    /**
     *  Toggle Stuff
     */
    toggleBoardFavourite: (
      state,
      { payload }: { payload: { workspaceId: number; boardId: number } }
    ) => {
      state[payload.workspaceId].boards[payload.boardId].isFavorite =
        !state[payload.workspaceId].boards[payload.boardId].isFavorite;
    },
    toggleCollapseCard(
      state,
      {
        payload,
      }: { payload: { workspaceId: number; boardId: number; cardId: number } }
    ) {
      state[payload.workspaceId].boards[payload.boardId].cards[
        payload.cardId
      ].isCollapsed =
        !state[payload.workspaceId].boards[payload.boardId].cards[
          payload.cardId
        ].isCollapsed;
    },
    toggleToDoCompleted: (
      state,
      {
        payload,
      }: {
        payload: {
          workspaceId: number;
          boardId: number;
          cardId: number;
          todoId: number;
        };
      }
    ) => {
      state[payload.workspaceId].boards[payload.boardId].cards[
        payload.cardId
      ].content[payload.todoId].isCompleted =
        !state[payload.workspaceId].boards[payload.boardId].cards[
          payload.cardId
        ].content[payload.todoId].isCompleted;
    },
    toggleBoardColor: (
      state,
      { payload }: { payload: { workspaceId: number; boardId: number } }
    ) => {
      const board = state[payload.workspaceId].boards[payload.boardId];
      if (board.bgColor === 'red') board.bgColor = 'blue';
      else if (board.bgColor === 'blue') board.bgColor = 'orange';
      else board.bgColor = 'red';
    },
  },
});

export const {
  saveWorkspaces,
  newWorkspace,
  newBoard,
  newList,
  newToDo,
  deleteWorkspace,
  deleteBoard,
  deleteCard,
  deleteToDo,
  changeToDoProperty,
  changeBoardProperty,
  changeCardTitle,
  updateCardsOrder,
  moveToDo,
  selectMenu,
  toggleBoardFavourite,
  toggleCollapseCard,
  copyWorkspaceTemplate,
  toggleToDoCompleted,
  toggleBoardColor,
  changeWorkspaceTitle,
} = workspacesSlice.actions;
export default workspacesSlice.reducer;
