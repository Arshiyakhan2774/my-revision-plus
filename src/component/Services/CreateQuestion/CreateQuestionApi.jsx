import { createApi, fetchBaseQuery, } from '@reduxjs/toolkit/query/react';
import { Api } from '../../Api/Api';

export const QuestionCreateApi = createApi({
  reducerPath: 'questionCreateApi',
  baseQuery: fetchBaseQuery({
    baseUrl: Api.API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      if (token) {
        headers.set('Authorization', `Bearer ${token}`); // Add the token to the Authorization header
      }
      return headers;
    },
  }),
  tagTypes: ['Post'], // Move tagTypes here
  endpoints: (builder) => ({
    getQuestion: builder.query({
      query: (id) => `questions/fullquestion/${id}`,
      providesTags: ['Post'], // Example usage
    }),
    getSubQuestion: builder.query({
      query: (id) => `questions/subques/${id}`,
      providesTags: ['Post'],
    }),
    deleteQuestion: builder.mutation({
      query: (id) => ({
        url: `questions/ques/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Post'], // Ensure the tag matches tagTypes
    }),
    deleteSubQuestion: builder.mutation({
      query: (id) => ({
        url: `questions/subques/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Post'],
    }),
    deleteSubChildQuestion: builder.mutation({
      query: (id) => ({
        url: `questions/subchildques/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Post'],
    }),
    createQuestion: builder.mutation({
      query: (formData) => ({
        url: 'questions/create',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Post'],
    }),
    createSubQuestion: builder.mutation({
      query: (formData) => ({
        url: 'questions/subquestion/create',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Post'],
    }),
    createSubChildQuestion: builder.mutation({
      query: (formData) => ({
        url: 'questions/subchildquestion/create',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Post'],
    }),
    createSubSatQuestion: builder.mutation({
      query: (formData) => ({
        url: 'questions/satsubquestion/create',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Post'],
    }),
    updateQuestion: builder.mutation({
      query: ({ questionId, formData }) => ({
        url: `questions/ques/${questionId}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['Post'],
    }),
    updateSubQuestion: builder.mutation({
      query: ({ questionId, formData }) => ({
        url: `questions/subques/${questionId}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['Post'],
    }),
    updateSubChildQuestion: builder.mutation({
      query: ({ questionId, formData }) => ({
        url: `questions/subchildques/${questionId}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['Post'],
    }),
  }),
});

export const {
  useCreateSubSatQuestionMutation,
  useGetQuestionQuery,
  useDeleteQuestionMutation,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteSubQuestionMutation,
  useCreateSubQuestionMutation,
  useUpdateSubQuestionMutation,
  useCreateSubChildQuestionMutation,
  useUpdateSubChildQuestionMutation,
  useDeleteSubChildQuestionMutation,
  useGetSubQuestionQuery,
} = QuestionCreateApi;
