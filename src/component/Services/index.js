import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import authReducer from './Authentication/AuthSlice';
import { setupAuthInterceptors } from './Authentication/AuthSlice';
import idReducer from "../store/UserSliceId";
import { userManageSlice } from './UserMangae/UserMangeSlice';
import { CategoryApi } from './Category/CategoryApi';
import { attendanceApi } from './Attendance/AttendanceApi';
import studentReducer from '../store/Random/StudentSlice.jsx';
import { userTypeApi } from './userType/UserTypeApi.jsx';

// Configuration for redux-persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'idSlice', 'student'], // only these reducers will be persisted
  // Optionally blacklist API reducers since they don't need persistence
  blacklist: [
    userManageSlice.reducerPath, 
    CategoryApi.reducerPath, 
    attendanceApi.reducerPath
  ]
};

const rootReducer = combineReducers({
  auth: authReducer,
  idSlice: idReducer,
  student: studentReducer,
  [userManageSlice.reducerPath]: userManageSlice.reducer,
  [CategoryApi.reducerPath]: CategoryApi.reducer,
  [attendanceApi.reducerPath]: attendanceApi.reducer,
  [userTypeApi.reducerPath]:userTypeApi.reducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable check
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
      immutableCheck: true
    }).concat(
      userManageSlice.middleware,
      CategoryApi.middleware,
      attendanceApi.middleware,
      userTypeApi.middleware,
    ),
  devTools: process.env.NODE_ENV === 'development',
});

// Initialize auth interceptors with store
setupAuthInterceptors(store);

// Create persistor
export const persistor = persistStore(store);

export default store;