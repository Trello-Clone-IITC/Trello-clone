import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define types for your card data
export interface Card {
  id: string;
  title: string;
  description?: string;
  listId: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

// Define the API slice
export const cardsApi = createApi({
  reducerPath: "cardsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/cards", // Adjust this to match your backend API
  }),
  tagTypes: ["Card"],
  endpoints: (builder) => ({
    getCards: builder.query<Card[], string>({
      query: (listId) => `?listId=${listId}`,
      providesTags: ["Card"],
    }),
    getCard: builder.query<Card, string>({
      query: (id) => `/${id}`,
      providesTags: ["Card"],
    }),
    createCard: builder.mutation<Card, Partial<Card>>({
      query: (newCard) => ({
        url: "",
        method: "POST",
        body: newCard,
      }),
      invalidatesTags: ["Card"],
    }),
    updateCard: builder.mutation<Card, { id: string; updates: Partial<Card> }>({
      query: ({ id, updates }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: updates,
      }),
      invalidatesTags: ["Card"],
    }),
    deleteCard: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Card"],
    }),
  }),
});

export const {
  useGetCardsQuery,
  useGetCardQuery,
  useCreateCardMutation,
  useUpdateCardMutation,
  useDeleteCardMutation,
} = cardsApi;
