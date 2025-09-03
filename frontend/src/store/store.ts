import { configureStore } from "@reduxjs/toolkit";
import cardSlice from "../features/board/components/card/redux/cardSlice";
import listSlice from "../features/board/components/List/redux/listSlice";

export const store = configureStore({
  reducer: {
    card: cardSlice,
    list: listSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
