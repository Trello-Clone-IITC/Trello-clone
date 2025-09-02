import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CardModalState {
  isOpen: boolean;
  cardId: string | null;
  cardTitle: string;
}

interface CardState {
  modal: CardModalState;
}

const initialState: CardState = {
  modal: {
    isOpen: false,
    cardId: null,
    cardTitle: "",
  },
};

const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    openCardModal: (
      state,
      action: PayloadAction<{ cardId: string; cardTitle: string }>
    ) => {
      state.modal.isOpen = true;
      state.modal.cardId = action.payload.cardId;
      state.modal.cardTitle = action.payload.cardTitle;
    },
    closeCardModal: (state) => {
      state.modal.isOpen = false;
      state.modal.cardId = null;
      state.modal.cardTitle = "";
    },
  },
});

export const { openCardModal, closeCardModal } = cardSlice.actions;
export default cardSlice.reducer;
