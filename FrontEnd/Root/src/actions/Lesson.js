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
           
            
            if ( Error.status === 401) {
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


export const addlesson = async(heading,token)=>{
    try{
        const response = await api.post('lessons/create/',{heading},{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response
    }
    catch (error){
        return error
    }
}

export const getlesson = async(token)=>{
    try{
        const response = await api.get('lessons/create/',{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response
    }
    catch (error){
        return error
    }
}

export const deleteLesson = async(token,id)=>{
    try{
  
        
        const response = await api.post(`lessons/delete/${id}`,{},{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response
    }
    catch (error){
        return error
    }
}

export const updateLesson = async(token,data,id)=>{
    try{
        console.log(token,data,id);
        
        const response = await api.put(`lessons/delete/${id}`,{"heading":data},{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response
    }
    catch (error){
        return error
    }
}



export const getContent = async(token,id)=>{
    try{

        const response = await api.get(`lessons/content/${id}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
            
        })
        return response
    }
    catch(error){
        return error
    }
} 


export const addContent = async(token,formData,id)=>{
    try{
        const response = await api.post(`lessons/content/${id}`,formData,{
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
            
        })
        return response
    }
    catch(error){
        return error
    }
}


export const deleteContent = async(token,id)=>{
    try{
  
        
        const response = await api.delete(`lessons/content/${id}`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response
    }
    catch (error){
        return error
    }
}


export const editContent = async (token, formData, id) => {
    try {
        const response = await api.patch(`lessons/content/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return response;
    } catch (error) {
        return error.response || error;
    }
};
