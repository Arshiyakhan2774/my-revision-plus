import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const api = axios.create({
  baseURL: 'https://myrevisionplus.com/api/v1/',
});


const initialState = {
  token: localStorage.getItem('authToken') || null,
  isAuthenticated: !!localStorage.getItem('authToken'),
  status: 'idle',
  error: null,
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Session expired or unauthorized. Clearing local storage.');
      localStorage.clear();
      window.localStorage.setItem('logoutEvent', Date.now()); 
      window.location.href = '/'; 
    }
    return Promise.reject(error);
  }
);

window.addEventListener('storage', (event) => {
  if (event.key === 'authToken' && !localStorage.getItem('authToken')) {
    alert('You have been logged out from another tab.');
    window.location.reload();
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Session expired or unauthorized. Clearing local storage.');
      localStorage.clear();
      window.localStorage.setItem('logoutEvent', Date.now()); 
      window.location.href = '/'; 
    }
    return Promise.reject(error);
  }
);

let autoLogoutTimer = null;
let activityHandler = null;

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post('/users/login', credentials);

      localStorage.clear();

   
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userResponse', JSON.stringify(response.data.user));

      if (autoLogoutTimer) {
        clearTimeout(autoLogoutTimer);
        autoLogoutTimer = null;
      }
      
      activityHandler = () => {
        if (autoLogoutTimer) clearTimeout(autoLogoutTimer);
        autoLogoutTimer = setTimeout(() => dispatch(logoutUser()), 3600000); // 1 घंटा
      };

      window.addEventListener('mousemove', activityHandler);
      window.addEventListener('keypress', activityHandler);
      window.addEventListener('click', activityHandler);
   
      activityHandler();

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);


export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
   
      if (autoLogoutTimer) {
        clearTimeout(autoLogoutTimer);
        autoLogoutTimer = null;
      }
      if (activityHandler) {
        window.removeEventListener('mousemove', activityHandler);
        window.removeEventListener('keypress', activityHandler);
        window.removeEventListener('click', activityHandler);
      }

      await api.get('/users/logout');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userResponse');
      window.localStorage.setItem('logoutEvent', Date.now());

      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

window.addEventListener('storage', (event) => {
  if (event.key === 'authToken' && !localStorage.getItem('authToken')) {
    alert('You have been logged out from another tab.');
    window.location.reload(); 
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.status = 'succeeded';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logoutUser.fulfilled, () => {
        return initialState;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
      });
  },
});

export const { resetError } = authSlice.actions;
export default authSlice.reducer;