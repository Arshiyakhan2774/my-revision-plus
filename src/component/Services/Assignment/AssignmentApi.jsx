import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Api } from '../../Api/Api';


export const assignmentApi = createApi({
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
//     deleteSchedule: builder.mutation({
//       query: (_id) => ({
//         url: `schedule/${_id}`, // Add `/` before `_id`
//         method: 'DELETE',
//       }),
//     }),
    getAssignmentList: builder.query({
        query:()=>({url :`assignment/list` , method: 'GET'   
        })
      }),
      getAssignmentListView: builder.query({
        query:(id)=>({url :`assignment/assign${id}` , method: 'GET'   
        })
       
      }),
      getTeacherAssignmentListView: builder.query({
        query:(id)=>({url :`teacherdashboard/get-teacher-assignmet-list/${id}` , method: 'GET'   
        })
          
      }),
  }),
});

// Export the generated hook correctly
export const { useGetAssignmentListQuery ,useGetAssignmentListViewQuery ,useGetTeacherAssignmentListViewQuery} = assignmentApi;
