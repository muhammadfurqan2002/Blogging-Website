import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser:null,
    error:null,
    loading:false
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    sigInStart:(state)=>{
        state.loading=true;
        state.error=null;
    },
    signInSuccess:(state,action)=>{
        state.currentUser=action.payload;
        state.loading=false;
        state.error=null;
    },
    signInFailure:(state,action)=>{
        state.loading=false;
        state.error=action.payload;
    },
    updateStart:(state)=>{
        state.loading=true;
        state.error=null;
    },
    updateSuccess:(state,action)=>{
        state.currentUser=action.payload;
        state.loading=false;
        state.error=null
    }, 
    updateFailure:(state,action)=>{
        state.loading=false;
        state.error=action.payload
    },
    deleteUserStart:(state)=>{
        state.loading=true,
        state.error=null
    },
    deleteUserSuccess:(state,)=>{
        state.currentUser=null
        state.loading=false,
        state.error=null
    },
    deleteUserFailure:(state,action)=>{
        state.loading=false,
        state.error=action.payload
    },
    signoutSuccess:(state)=>{
        state.currentUser=null,
        state.error=null,
        state.loading=false
    }

  },
});

export const {signoutSuccess,deleteUserFailure,deleteUserStart,deleteUserSuccess,sigInStart,signInFailure,signInSuccess,updateFailure,updateStart,updateSuccess}=userSlice.actions;
export default userSlice.reducer;
