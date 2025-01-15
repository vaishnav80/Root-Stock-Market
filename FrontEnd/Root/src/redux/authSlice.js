import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
    name:'',
    email:'',
    token:'',
    refreshToken:'',
    is_active:false,
    is_staff : false,
    id : null
}

const authSlicer = createSlice({
    name:'auth',
    initialState:INITIAL_STATE,
    reducers:{
        login:(state,action)=>{
            state.name=action.payload.user.first_name;
            state.email=action.payload.user.email;
            state.token=action.payload.tokens.access;
            state.refreshToken=action.payload.tokens.refresh;
            state.is_active = action.payload.user.is_active;
            state.is_staff = action.payload.user.is_staff;
            state.id = action.payload.user.id
        },
        logout : (state,action)=>{
            state.name=null;
            state.email=null;
            state.token=null;
            state.refreshToken=null;
            state.is_active=null;
            state.is_staff = null;  
            state.id = null
        },
        active : (state,action)=>{
            state.is_active = action.payload
        }
        
    }
})




export const{login,logout,active} = authSlicer.actions;
export default authSlicer.reducer;