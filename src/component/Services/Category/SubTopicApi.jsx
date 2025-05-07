import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Api } from '../../Api/Api';

export const SubTopicApi = createApi({
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
  tagTypes: ['SubTopic'],

  endpoints: (builder) => ({
    getSubTopicList: builder.query({
      query: () => `categorys/subtopic`,
      providesTags: ['SubTopic'],
    }),

    saveSubTopic: builder.mutation({
      query: ({ selectedBoard, selectedSubject, selectedSubjectLevel, selectedSource, selectedPaper, selectedTopic, subtopicName }) => ({
        url: `categorys/subtopic/create`,
        method: 'POST',
        body: {
          board_id: selectedBoard,
          subject_id: selectedSubject,
          subject_level_id: selectedSubjectLevel,
          source_id: selectedSource,
          paper_id: selectedPaper,
          topic_id: selectedTopic,
          subtopic_name: subtopicName,
        },
      }),
      invalidatesTags: ['SubTopic'],
    }),

    updateSubTopic: builder.mutation({
      query: ({ subtopicId, selectedBoard, selectedSubject, selectedSubjectLevel, selectedSource, selectedPaper, selectedTopic, subtopicName }) => ({
        url: `categorys/subtopic/${subtopicId}`,
        method: 'PATCH',
        body: {
          board_id: selectedBoard,
          subject_id: selectedSubject,
          subject_level_id: selectedSubjectLevel,
          source_id: selectedSource,
          paper_id: selectedPaper,
          topic_id: selectedTopic,
          subtopic_name: subtopicName,
        },
      }),
      invalidatesTags: ['SubTopic'],
    }),

    deleteSubTopic: builder.mutation({
      query: (id) => ({
        url: `categorys/subtopic/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SubTopic'],
    }),
  }),
});

export const {
  useGetSubTopicListQuery,
  useSaveSubTopicMutation,
  useUpdateSubTopicMutation,
  useDeleteSubTopicMutation,
} = SubTopicApi;
