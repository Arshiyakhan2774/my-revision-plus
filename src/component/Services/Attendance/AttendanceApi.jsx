import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Api } from '../../Api/Api';


export const attendanceApi = createApi({
  reducerPath: 'attendanceApi',
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
    createAttendance: builder.mutation({
      query: (payload) => ({
        url: '/attendance/create',
        method: 'POST',
        body: payload,
      }),
    }),
    fetchSchedule: builder.query({
      query: () => '/schedule',
    }),
    fetchScheduleByTeacher: builder.query({
      query: (_id) => `teacherdashboard/get-teacher-schedule/${_id}`,
    }),
    attendance: builder.query({
      query: () => '/attendance/list',
    }),
    attendanceByTeacher: builder.query({
      query: (_id) => `teacherdashboard/get-teacher-attendance/${_id}`,
    }),
    deleteAttendance: builder.mutation({
      query: (_id) => ({
        url: `/attendance/${_id}`,
        method: 'DELETE',
      }),
    }),
    studentDetails: builder.query({
      query: (studentId) => `/attendance/${studentId}`,
    }),
    studentDetailsForTeacher: builder.query({
      query: ({ user_id, _id }) =>
        `/teacherdashboard/get-teacher-attendance-details/${user_id}/${_id}`,
    }),
    TeacherDetailsForStudent: builder.query({
      query: (_id ) => `studentdashboard/get-student-attendance/${_id}`,
    }),
    teacherForStudent: builder.query({
      query: ({ user_id, _id }) =>
        `studentdashboard/get-student-attendance-details/${user_id}/${_id}`,
  
    }),
  }),
});

export const {
  useTeacherDetailsForStudentQuery,
  useCreateAttendanceMutation,
  useFetchScheduleQuery,
  useFetchScheduleByTeacherQuery,
  useAttendanceQuery,
  useAttendanceByTeacherQuery,
  useDeleteAttendanceMutation,
  useStudentDetailsQuery,
  useLazyStudentDetailsForTeacherQuery,
 useLazyTeacherForStudentQuery,
} = attendanceApi;
