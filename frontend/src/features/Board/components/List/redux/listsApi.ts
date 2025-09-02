import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { List, Card } from "./listSlice";

// Define the API slice
export const listsApi = createApi({
  reducerPath: "listsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/lists", // Adjust this to match your backend API
  }),
  tagTypes: ["List", "Card"],
  endpoints: (builder) => ({
    getLists: builder.query<List[], string>({
      query: (boardId) => `?boardId=${boardId}`,
      providesTags: ["List"],
    }),
    getList: builder.query<List, string>({
      query: (id) => `/${id}`,
      providesTags: ["List"],
    }),
    createList: builder.mutation<List, Partial<List>>({
      query: (newList) => ({
        url: "",
        method: "POST",
        body: newList,
      }),
      invalidatesTags: ["List"],
    }),
    updateList: builder.mutation<List, { id: string; updates: Partial<List> }>({
      query: ({ id, updates }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: ["List"],
    }),
    deleteList: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["List"],
    }),
    // Card endpoints
    getCards: builder.query<Card[], string>({
      query: (listId) => `/cards?listId=${listId}`,
      providesTags: ["Card"],
    }),
    createCard: builder.mutation<Card, Partial<Card>>({
      query: (newCard) => ({
        url: "/cards",
        method: "POST",
        body: newCard,
      }),
      invalidatesTags: ["Card", "List"],
    }),
    updateCard: builder.mutation<Card, { id: string; updates: Partial<Card> }>({
      query: ({ id, updates }) => ({
        url: `/cards/${id}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: ["Card"],
    }),
    deleteCard: builder.mutation<void, string>({
      query: (id) => ({
        url: `/cards/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Card", "List"],
    }),
  }),
});

export const {
  useGetListsQuery,
  useGetListQuery,
  useCreateListMutation,
  useUpdateListMutation,
  useDeleteListMutation,
  useGetCardsQuery,
  useCreateCardMutation,
  useUpdateCardMutation,
  useDeleteCardMutation,
} = listsApi;
