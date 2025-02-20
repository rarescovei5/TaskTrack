import { createSlice } from '@reduxjs/toolkit';
import { Workspace } from '../../types';

const loadState = (): Array<Workspace> => {
  try {
    const data = localStorage.getItem('workspaces');
    return data ? JSON.parse(data) : [];
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
        dueDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        createdDate: new Date(),
      });
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
  selectMenu,
  toggleBoardFavourite,
  toggleCollapseCard,
  toggleToDoCompleted,
} = workspacesSlice.actions;
export default workspacesSlice.reducer;
