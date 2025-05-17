import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Api } from '../../Api/Api';


export const scheduleApi = createApi({
  reducerPath: 'scheduleApi',
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
    deleteSchedule: builder.mutation({
      query: (_id) => ({
        url: `schedule/${_id}`,
        method: 'DELETE',
      }),
    }),
    getScheduleStudent: builder.query({
      query: (id) => ({
        url: `users/user-by-teacher/${id}`,
        method: 'GET',
      }),
    }),
  }),
});


export const { useDeleteScheduleMutation, useGetScheduleStudentQuery } = scheduleApi;
