import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Api } from '../../Api/Api';


export const userTypeApi = createApi({
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
  endpoints: (builder) => ({
    deleteUserType: builder.mutation({
      query: (_id) => ({
        url: `users/type/${_id}`, // Add `/` before `_id`
        method: 'DELETE',
      }),
    }),
  }),
});

// Export the generated hook correctly
export const { useDeleteUserTypeMutation } = userTypeApi;
