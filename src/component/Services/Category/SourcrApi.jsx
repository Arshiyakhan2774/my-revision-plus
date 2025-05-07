
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Api } from '../../Api/Api';

export const SourceApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: Api.API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Post', 'Source'], // Adding 'Source' here
  endpoints: (builder) => ({
    getViewSubjectList: builder.query({
      query: () => `categorys/subject`,
      providesTags: ['Post'],
    }),

    saveSource: builder.mutation({
      query: ({ selectedBoard, selectedSubject, selectedSubjectLevel, selectedSource }) => ({
        url: `categorys/source/create`,
        method: 'POST',
        body: {
          board_id: selectedBoard,
          subject_id: selectedSubject,
          subject_level_id: selectedSubjectLevel,
          source_name: selectedSource,
        },
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }], 
    }),
  }),
});

export const {
useSaveSourceMutation,
} = SourceApi;
