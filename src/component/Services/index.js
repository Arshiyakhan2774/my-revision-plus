import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import authReducer from './Authentication/AuthSlice';
import idReducer from "../store/all-Id-Slice/IdSlice.jsx";
import { userManageSlice } from './UserMangae/UserMangeSlice';
import { CategoryApi } from './Category/CategoryApi';
import { attendanceApi } from './Attendance/AttendanceApi';
import studentReducer from '../store/Random/StudentSlice.jsx';
import { userTypeApi } from './userType/UserTypeApi.jsx';
import { scheduleApi } from './SchedulePage/ScheduleApi.jsx';
import { OnlineClassesApi } from './OnlineClasses/OnlineClassesApi.jsx';
import { QuestionCreateApi } from './CreateQuestion/CreateQuestionApi.jsx';
import { assignmentApi } from './Assignment/AssignmentApi.jsx';

// Configuration for redux-persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'idSlice', 'student'], 
  
  blacklist: [
    userManageSlice.reducerPath, 
    CategoryApi.reducerPath, 
    attendanceApi.reducerPath,
    scheduleApi.reducerPath,
    userTypeApi.reducerPath,
    OnlineClassesApi.reducerPath,
    QuestionCreateApi.reducerPath,
    assignmentApi.reducerPath,
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
  [scheduleApi.reducerPath]:scheduleApi.reducer,
  [OnlineClassesApi.reducerPath]:OnlineClassesApi.reducer,
  [QuestionCreateApi.reducerPath]:QuestionCreateApi.reducer,
  [ assignmentApi.reducerPath]:assignmentApi.reducer,
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
      scheduleApi.middleware,
      OnlineClassesApi.middleware,
      QuestionCreateApi.middleware,
      assignmentApi.middleware,
    ),
  devTools: process.env.NODE_ENV === 'development',
});

export const persistor = persistStore(store);

export default store;