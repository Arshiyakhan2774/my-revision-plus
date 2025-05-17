import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Api } from '../../Api/Api';



export const OnlineClassesApi = createApi({
  reducerPath: 'OnlineClassesApi',
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
    getOnlineClasses: builder.query({
      query: () => ({
        url: '/onlineclass', 
        method: 'GET',
      }),
    }),
 
    getOnlineClassesTeacher: builder.query({
        query: (id) => ({
          url: `teacherdashboard/onlineclass-by-teachers/${id}`,
          method: 'GET',
        }),
      }),
      getOnlineClassesStudent: builder.query({
        query: (id) => ({
          url: `studentdashboard/get-onlineclass-teacher/${id}`,
          method: 'GET',
        }),
      }),
      
  }),
});

export const {useGetOnlineClassesStudentQuery, useGetOnlineClassesQuery,useGetOnlineClassesTeacherQuery } = OnlineClassesApi;
