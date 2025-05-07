    import { createSlice } from "@reduxjs/toolkit";

    const initialState = {
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
    };

    const idSlice = createSlice({
    name: "idSlice",
    initialState,
    reducers: {
        setUserResponse: (state, action) => {
        state.userResponse = action.payload;
        },
    },
    });

    export const { setUserResponse } = idSlice.actions;
    export default idSlice.reducer;
