import axios from "axios";

import store from '../redux/store';
import { logout } from "../redux/authSlice";

const baseURL = "http://127.0.0.1:8000/"

const api = axios.create({
    baseURL,

  });

api.interceptors.response.use(
    async (response) => {
        try {
            console.log(store.getState().auth.tokenoken,'fgsdfg');
            
          const statusResponse = await axios.get(`${baseURL}account/check-status/`, {
            headers: {
              Authorization: `Bearer ${store.getState().auth.token}`, 
            },
            withCredentials: true,
          });
          store.dispatch(active(statusResponse.data.is_active));
          if (!statusResponse.data.is_active) {
            store.dispatch(logout());
          }
        } catch (Error) {
            if (  Error.status === 401) {
                store.dispatch(logout());
            }
        }
    
        return response;
      },
    (error) => {
        
        if (error.response && error.response.status === 401) {
            store.dispatch(logout());
        }
        return Promise.reject(error);
    }
);

  
export const RegisterUser = async (first_name,email,password,confirm_password)=>{
    try {
        const response = await api.post('account/register/',{first_name,email,password,confirm_password});
        console.log('dfdf',response);
        return response
    
    }
    catch(error){
        return error.response
    }
}

export const loginUser = async (email,password)=>{
    try{
        const response = await api.post('account/login/',{email,password})
        console.log(response,"user");
        return response
    }
    catch(error){
        return error.response
    }
}

export const userProfile = async (token) => {
    try {
        const response = await api.get('account/profile', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(response.data,'Profile');
        return response
         
    } catch (error) {
        console.error("Error fetching user profile:", error);
        
    }
};

export const userLogout = async (access,refresh) => {
    console.log(refresh);
    
    try {
        const response = await api.post('account/logout/', 
            { refresh_token: refresh },  
            {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            }
        );
        console.log(response.data.message);
        return response;
    } catch (error) {
        console.log(error.response.data.message);
        
        return error.response
    }
}

export const userList = async (access)=>{
    console.log('dfs');
    
    try {
        const response = await api.get('account/userlist',{
        headers: {
            Authorization: `Bearer ${access}`,
        }    
    })
    console.log(response);
    
        return response
    } catch (error) {
        
    }
}

export const forgotPassword = async (email)=>{
    try {
        const response = await api.post('account/forgot_password/',{email})
        console.log(response);
        return response
    } catch (error) {
        console.log(error);
        
    }
}

export const resetPassword = async (u_id,token,password)=>{
    console.log('sdfsdf');
    
    try {
        const response = await api.post('account/reset-password/',{u_id,token,password})
        console.log(response);
        
    } catch (error) {
        console.log(error);
        
    }
}
