import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { cardsApi } from "../features/Board/components/card/redux/cardsApi";
import { listsApi } from "../features/board/components/list/redux/listsApi";
import cardSlice from "../features/Board/components/card/redux/cardSlice";
import listSlice from "../features/board/components/list/redux/listSlice";

export const store = configureStore({
  reducer: {
    [cardsApi.reducerPath]: cardsApi.reducer,
    [listsApi.reducerPath]: listsApi.reducer,
    card: cardSlice,
    list: listSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cardsApi.middleware, listsApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
