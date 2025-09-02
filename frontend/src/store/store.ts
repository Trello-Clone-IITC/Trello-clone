import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { cardsApi } from "../features/board/components/card/redux/cardsApi";
import { listsApi } from "../features/board/components/List/redux/listsApi";
import cardSlice from "../features/board/components/card/redux/cardSlice";
import listSlice from "../features/board/components/List/redux/listSlice";

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
