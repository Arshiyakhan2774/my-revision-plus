import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  previewId: null,
 subQuestionId: null,
 subChildQuestionId: null,
  subTopicId:[],
  boardId:"",
  assignmentSubTopicId:[],
  successMessage: '',
  isVisible: false,
  isEditing: false,
  questionId:null,
  questionEdit: null ,
  studentIdSingle: null,
  assignmentId: null,
  selectedSubquestionId: null,
  selectedSubChildquestionId: null,
  selectedId: null,
  questionIdMain : null ,
questionsData: [],
savedData: null,
hostId: null,
showQuestion: false,
isDisplayCardOpen: true,
hideComponent: true,
longQuestion: false,
studentDetaId:null,
userResponse: (() => {
  try {
    const item = localStorage.getItem('userResponse');
    if (!item || item === 'undefined') return null;
    return JSON.parse(item);
  } catch (error) {
    console.error('Failed to parse userResponse:', error);
    return null;
  }
})(),

sharedAssignment: null,
studentDetaIdforTeacher :null ,
assignmentBoardId:null,
assignmentSubjectId:null,
assignmentSubjectLevelId:null,
assignmentPaperId:null,
assignmentTopicId:null,
assignmentSourceId :null,

};

const idSlice = createSlice({
  name: "idSlice",
  initialState,
  reducers: {
    toggleVisibility: (state) => {
      state.isVisible = !state.isVisible;  
    },
    setHostId: (state, action) => {
      state.hostId = action.payload;
    },
    setVisibility: (state, action) => {
      state.isVisible = action.payload;  
    },
    setPreviewId: (state, action) => {
      state.previewId = action.payload; 
    },
    setSubQuestionId: (state, action) => {
      state.subQuestionId = action.payload; 
    },
    setSubChildQuestionId: (state, action) => {
      state.subQuestionId = action.payload; 
    },
      setSubTopicId: (state, action) => {
        state.subTopicId = action.payload; 
      },
      setBoardId: (state, action) => {
        state.boardId = action.payload;  
      },
      setAssignmentSubTopicId: (state, action) => {
        state. assignmentSubTopicId = action.payload; 
      },
      clearSubTopicId: (state) => {
        state.subTopicId = null;
      },
     
      setSuccessMessage: (state, action) => {
        state.successMessage = action.payload;
      },
      clearNotifications: (state) => {
        state.successMessage = '';
      },
      setEditingState: (state, action) => {
        state.isEditing = action.payload;
      },
      setQuestionId: (state, action) => {
        state.questionId = action.payload; 
      },
      setQuestionIdMain: (state, action) => {
        state.questionIdMain = action.payload; 
      },
      
      setQuestionEdit: (state, action) => {
        state.questionEdit = action.payload; 
      },
      setAssignmentId: (state, action) => {
        state.assignmentId = action.payload;
      },
      setSelectedSubquestionId: (state, action) => {
        state.selectedSubquestionId = action.payload;
      },
      setSelectedSubChildquestionId: (state, action) => {
        state.selectedSubChildquestionId = action.payload;
      },
      setSelectedId: (state, action) => {
        state.selectedId = action.payload;
      },
   
  setQuestionsData: (state, action) => {
    state.questionsData = action.payload;
  },
  setStudentIdSingle: (state, action) => {
    state.studentIdSingle = action.payload;  
  },
  setStudentDetaId: (state, action) => {
    state.studentDetaId = action.payload;  
  },
  setStudentDetaIdforTeacher: (state, action) => {
    state.studentDetaId = action.payload;  
  },
  setSavedData: (state, action) => {
    state.data = action.payload;
},
toggleShowQuestion: (state) => {
  state.showQuestion = !state.showQuestion; 
},
showQuestion: (state) => {
  state.showQuestion = true; 
},
hideQuestion: (state) => {
  state.showQuestion = false; 
},
setDisplayCardOpenHide: (state,) => {
  state.isDisplayCardOpen = false;
},
setDisplayCardOpen: (state,) => {
  state.isDisplayCardOpen = true;
},
setHideComponent: (state,) => {
  state.hideComponent = false;
},
setShowComponent: (state,) => {
  state.hideComponent = true;
},
setUserResponse: (state, action) => {
  state.userResponse = action.payload;
},
clearUserResponse: (state) => {
  state.userResponse = null;
  localStorage.removeItem('userResponse'); 
},
setLongQuestion: (state, action) => {
  state.longQuestion = action.payload;
},
setAssignmentBoardId: (state, action) => {
  state.assignmentBoardId = action.payload;
},
setAssignmentSubjectId: (state, action) => {
  state.assignmentSubjectId = action.payload;
},
setAssignmentSubjectLevelId: (state, action) => {
  state.assignmentSubjectLevelId = action.payload;
},
setAssignmentPaperId: (state, action) => {
  state.assignmentPaperId = action.payload;
},
setAssignmentSourceId :(state, action) => {
  state.assignmentSourceId = action.payload;
},
setAssignmentTopicId: (state, action) => {
  state.assignmentTopicId = action.payload;
},
setSharedAssignment: (state, action) => {
  state.sharedAssignment = action.payload; 
},
clearUserResponse: (state) => {
  state.userResponse = null;
},
  },
});

export const { setAssignmentBoardId,setAssignmentSourceId,setAssignmentSubjectId,setAssignmentSubjectLevelId,setAssignmentPaperId,setAssignmentTopicId,setStudentDetaIdforTeacher ,setSharedAssignment,setStudentDetaId , setUserResponse,setDisplayCardOpenHide,setShowComponent,setDisplayCardOpen,setHideComponent,setLongQuestion,showQuestion,toggleShowQuestion, hideQuestion, setBoardId, setStudentIdSingle,setQuestionsData,setPreviewId,setSubTopicId,clearSubTopicId,setSelectedQuestionId, setSelectedSubChildquestionId,selectedSubquestionId, setQuestionEdit,setQuestionId, setSuccessMessage, clearNotifications,setSubQuestionId ,setVisibility,toggleVisibility,setSubChildQuestionId,setAssignmentSubTopicId ,setEditingState ,  setAssignmentId, 
    setSelectedSubquestionId,clearUserResponse, 
    setSelectedId ,setQuestionIdMain,setSavedData,setHostId} = idSlice.actions;
export default idSlice.reducer;

