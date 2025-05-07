import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Api } from '../../Api/Api';

export const TopicApi = createApi({
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
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    getViewSubjectList: builder.query({
      query: () => `categorys/subject`,
      providesTags: ['Post'],
    }),

    saveTopic: builder.mutation({
      query: ({selectedBoard,selectedSubject,selectedSubjectLevel,selectedSource,selectedPaper,selectedTopic }) => ({
        url: `categorys/topic/create`,
        method: 'POST',
        body: {
        
          board_id: selectedBoard,
        subject_id: selectedSubject,
        subject_level_id: selectedSubjectLevel,
        source_id: selectedSource,
        paper_id: selectedPaper,
        topic_name: selectedTopic,
        },
      }),
      invalidatesTags: ['Post'],
    }),
    // updateSubject: builder.mutation({
    //     query: ({ selectedTeacher, subjectName }) => ({
    //       url: `categorys/subject/`,
    //       method: 'PATCH',
    //       body: {
    //         subject_id: selectedTeacher.subject_id,
    //         board_id: selectedTeacher.boardID,
    //         subjectName: subjectName,
    //       },
    //     }),
    //     invalidatesTags: ['Post'],
    //   }),
    // deleteSubject: builder.mutation({
    //   query: (deleteId) => ({
    //     url: `categorys/subject`,
    //     method: 'DELETE',
    //     body: { deleteId },
    //   }),
    //   invalidatesTags: ['Post'],
    // }),
  }),
});

export const {
useSaveTopicMutation
} = TopicApi;