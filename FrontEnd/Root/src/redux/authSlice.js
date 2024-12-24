import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
    name:'',
    email:'',
    token:'',
    refreshToken:''
}

const authSlicer = createSlice({
    name:'auth',
    initialState:INITIAL_STATE,
    reducers:{
        login:(state,action)=>{
            state.name=action.payload.first_name;
            state.email=action.payload.email;
            state.token=action.payload.token;
            state.refreshToken=action.payload.refreshToken;
        }
        
    }
})




export const{login} = authSlicer.actions;
export default authSlicer.reducer;