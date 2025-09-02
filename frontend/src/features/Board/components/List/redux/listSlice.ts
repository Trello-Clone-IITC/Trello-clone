import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Card {
  id: string;
  title: string;
  description?: string;
  listId: string;
  position: number;
  labels?: Array<{
    id: string;
    title: string;
    color: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface List {
  id: string;
  title: string;
  boardId: string;
  position: number;
  cards: Card[];
  createdAt: string;
  updatedAt: string;
}

interface ListState {
  lists: List[];
  editingListId: string | null;
}

const initialState: ListState = {
  lists: [],
  editingListId: null,
};

const listSlice = createSlice({
  name: "list",
  initialState,
  reducers: {
    setLists: (state, action: PayloadAction<List[]>) => {
      state.lists = action.payload;
    },
    addList: (state, action: PayloadAction<List>) => {
      state.lists.push(action.payload);
    },
    updateListTitle: (
      state,
      action: PayloadAction<{ listId: string; title: string }>
    ) => {
      const list = state.lists.find((l) => l.id === action.payload.listId);
      if (list) {
        list.title = action.payload.title;
        list.updatedAt = new Date().toISOString();
      }
    },
    deleteList: (state, action: PayloadAction<string>) => {
      state.lists = state.lists.filter((list) => list.id !== action.payload);
    },
    addCardToList: (
      state,
      action: PayloadAction<{ listId: string; card: Card }>
    ) => {
      const list = state.lists.find((l) => l.id === action.payload.listId);
      if (list) {
        list.cards.push(action.payload.card);
        list.updatedAt = new Date().toISOString();
      }
    },
    updateCard: (
      state,
      action: PayloadAction<{ cardId: string; updates: Partial<Card> }>
    ) => {
      const { cardId, updates } = action.payload;
      state.lists.forEach((list) => {
        const card = list.cards.find((c) => c.id === cardId);
        if (card) {
          Object.assign(card, updates);
          card.updatedAt = new Date().toISOString();
          list.updatedAt = new Date().toISOString();
        }
      });
    },
    deleteCard: (state, action: PayloadAction<string>) => {
      const cardId = action.payload;
      state.lists.forEach((list) => {
        const cardIndex = list.cards.findIndex((c) => c.id === cardId);
        if (cardIndex !== -1) {
          list.cards.splice(cardIndex, 1);
          list.updatedAt = new Date().toISOString();
        }
      });
    },
    setEditingListId: (state, action: PayloadAction<string | null>) => {
      state.editingListId = action.payload;
    },
  },
});

export const {
  setLists,
  addList,
  updateListTitle,
  deleteList,
  addCardToList,
  updateCard,
  deleteCard,
  setEditingListId,
} = listSlice.actions;

export default listSlice.reducer;
