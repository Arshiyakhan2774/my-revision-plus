import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Api } from '../../Api/Api';


// API Setup
export const SubjectApi = createApi({
  reducerPath: 'SubjectApi',
  baseQuery: fetchBaseQuery({
    baseUrl:  Api.API_URL, 
    prepareHeaders: (headers, { getState }) => {
      // Ensure the Authorization header is set if the token exists in state
      const token = getState().auth.token; // Assuming token is in the auth slice
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json'); // Set Content-Type to JSON
      return headers;
    },
  }),
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    // Get subjects list
    getViewSubjectList: builder.query({
      query: () => 'categorys/subject',
      providesTags: ['Post'],
    }),

    // Update a subject
    updateSubject: builder.mutation({
      query: ({ selectedTeacher, subjectName }) => ({
        url: `categorys/subject/`,
        method: 'PATCH',
        body: {
          subject_id: selectedTeacher.subject_id,
          board_id: selectedTeacher.boardID,
          subject_name: subjectName,
        },
      }),
      invalidatesTags: ['Post'],
    }),

    // Save a subject level
    saveSubjectLevel: builder.mutation({
      query: ({ selectedBoard, selectedSubject, subjectLevelName }) => ({
        url: '/categorys/subjectlevel/create',
        method: 'POST',
        body: {
          board_id: selectedBoard,
          subject_id: selectedSubject,
          subject_level_name: subjectLevelName,
        },
      }),
      invalidatesTags: ['Post'],
    }),

    // Uncomment to delete subject if needed
    // deleteSubject: builder.mutation({
    //   query: (deleteId) => ({
    //     url: `categorys/subject/${deleteId}`,
    //     method: 'DELETE',
    //   }),
    //   invalidatesTags: ['Post'],
    // }),
  }),
});

// Export hooks for usage in components
export const {
  useGetViewSubjectListQuery,
  useUpdateSubjectMutation,
  useSaveSubjectLevelMutation,
} = SubjectApi;
