// src/Services/UserMangae/UserMangeSlice.jsx

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Api } from '../../Api/Api';


// import api from '../../Utilities/Api/Api';

// const axiosBaseQuery = () => async ({ url, method, data }) => {
//   try {
//     const result = await api({ url, method, data });
//     return { data: result.data };
//   } catch (axiosError) {
//     return {
//       error: {
//         status: axiosError.response?.status,
//         message: axiosError.message,
//         data: axiosError.response?.data,
//       },
//     };
//   }
// };
export const userManageSlice = createApi({
  reducerPath: 'userManage',
  baseQuery: fetchBaseQuery({
    baseUrl: Api.API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
 
  endpoints: (builder) => ({
    getAdmin: builder.query({
      query: () => ({ url: '/users/getteacher', method: 'GET' }),
    }),
    getUser: builder.query({
      query: () => ({ url: 'users/getstudent', method: 'GET' }),
    }),
    getUserTypes: builder.query({
      query: () => ({ url: '/users/usertype', method: 'GET' }),
    }),
    getUserTeacher: builder.query({
      query: () => ({ url: '/users/teacher', method: 'GET' }),
    }),
    getTeacherMapping: builder.query({
      query:()=>({url : "/questions/listmapping" , method: 'GET'
      })
    }),
    getStudentMapping:builder.query({
      query:()=>({url : "/users/stlist" , method: 'GET'
      })
    }),
    getTeacherMappingById: builder.query({
      query: (teacherId) => ({
        url: `/questions/listmappingteacher/${teacherId}`,
        method: 'GET',
      }),
    }),
    addUser: builder.mutation({
      query: (formData) => ({
        url: '/users/create',
        method: 'POST',
        data: formData,
      }),
    }),
    updateUser: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        data: formData,
      }),
    }),
    updateUserAdmin: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        data: formData,
      }),
    }),
    updatePassword: builder.mutation({
      query: ({ passwordData, id }) => ({
        url: `users/update-new-password/${id}`,
        method: "PATCH",
        body: passwordData,
      }),
      invalidatesTags: ["user"],
    }),
    deleteUser: builder.mutation({
      query: (_id) => ({
        url: `users/${_id}`, 
        method: "DELETE",
      }),
        
    }),
    updatePasswordUser: builder.mutation({
      query: ({ passwordData, id }) => ({
        url: `users/update-new-password/${id}`,
        method: "PATCH",
        body: passwordData,
      }),
      invalidatesTags: ["user"],
    }),
    deleteStudent: builder.mutation({
      query: (_id) => ({
        url: `users/${_id}`, 
        method: "DELETE",
      }),
        
    }),
    mapTeacher: builder.mutation({
      query: (formData) => ({
        url: 'questions/subjectmapping',
        method: 'POST',
        data: formData,
      }),
    }),
    deleteMapping: builder.mutation({
      query: (_id) => ({
        url: `questions/subjectmapping/${_id}`,
        method: "DELETE",
      }),
        
    }),
    deleteStudentMapping: builder.mutation({
      query: (_id) => ({
        url: `/users/stlist/${_id}`,
        method: "DELETE",
      }),
        
    }),
  }),
});

export const {
  useDeleteStudentMappingMutation,
  useDeleteMappingMutation,
  useGetTeacherMappingQuery,
  useMapTeacherMutation,
  useDeleteStudentMutation,
  useUpdatePasswordUserMutation,
  useDeleteUserMutation,
 useUpdatePasswordMutation,
  useUpdateUserAdminMutation,
  useGetUserTypesQuery,
  useGetUserTeacherQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useGetUserQuery,
  useGetAdminQuery,
  useGetStudentMappingQuery,
  useGetTeacherMappingByIdQuery,
} = userManageSlice;
