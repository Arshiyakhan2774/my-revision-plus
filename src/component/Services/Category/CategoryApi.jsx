import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Api } from '../../Api/Api';


export const CategoryApi = createApi({
  reducerPath: 'CategoryApi',
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
  endpoints: (builder) => ({
    getCategoryList: builder.query({
      query: () => `categorys/allcategory`,
      providesTags: ['Category'],
    }),
    getSubjects: builder.query({
      query: () => 'categorys/subject',
      providesTags: ['Subject'],
    }),
    saveSubject: builder.mutation({
      query: ({ selectedBoard, subjectName }) => ({
        url: `categorys/subject/create`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // Ensure headers are correct
        body: { 
          board_id: selectedBoard, // Ensure this matches the backend schema
          subject_name: subjectName, // Ensure this matches the backend schema
        },
      }),
      invalidatesTags: ['Subject'],
    }),
    
    deleteSubject: builder.mutation({
      query: (id) => ({
        url: `categorys/subject/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Subject'],
    }),
    updateSubject: builder.mutation({
      query: ({ id, board_id, subject_name }) => ({
        url: `categorys/subject/${id}`,
        method: 'PATCH',
        body: JSON.stringify({ board_id, subject_name }), // Sending data as JSON
      }),
      invalidatesTags: ['Subject'],
    }),
  }),
});

export const {
  useGetCategoryListQuery,
  useGetSubjectsQuery,
  useSaveSubjectMutation,
  useDeleteSubjectMutation,
  useUpdateSubjectMutation,
} = CategoryApi;
