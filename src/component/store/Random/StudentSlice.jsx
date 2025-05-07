
import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  studentId: null, 
  studentDetailsId: null,
  teacherId: null,
    
    boardId: null,
    subjectId: null,
    subjectLevelId: null,
    attendancedata: null,
    isVisible: false,
};
const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    setStudentId: (state, action) => {
      state.studentId = action.payload; 
    },
    setStudentDetailsId: (state, action) => {
      state.studentDetailsId = action.payload; 
    },
    setAttendanceData : (state, action) => {
      state.attendancedata = action.payload;
    },
    setTeacherId: (state, action) => {
      state.teacherId = action.payload;
    },
    setBoardId: (state, action) => {
      state.boardId = action.payload;
    },
    setSubjectId: (state, action) => {
      state.subjectId = action.payload;
    },
    setSubjectLevelId: (state, action) => {
      state.subjectLevelId = action.payload;
    },
    openDisplayCard: (state) => {
      state.isDisplayCardOpen = true;
      localStorage.setItem('isDisplayCardOpen', JSON.stringify(true));
    },
    closeDisplayCard: (state) => {
      state.isDisplayCardOpen = false;
      localStorage.setItem('isDisplayCardOpen', JSON.stringify(false));
    },
    toggleDisplayCard: (state) => {
      state.isDisplayCardOpen = !state.isDisplayCardOpen;
      localStorage.setItem('isDisplayCardOpen', JSON.stringify(state.isDisplayCardOpen));
    },
  },
});

export const { openDisplayCard, closeDisplayCard, toggleDisplayCard 
   , setAttendanceData ,setStudentDetailsId ,setTeacherId, setStudentId, setBoardId, setSubjectId, setSubjectLevelId  } = studentSlice.actions;

export default studentSlice.reducer;
