import axios from "axios";

import store from '../redux/store';
import { logout } from "../redux/authSlice";
import { data } from "react-router-dom";

const baseURL = "https://api.rootstocks.site/"

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


export const getChatUser = async(token)=>{
    try{
        const response = await api.get('community/chat_user/',{
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

export const getChat = async(token)=>{
    try{
        const response = await api.get('community/chat_data/',{
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

export const postChat = async(token,data)=>{
    try{
        const response = await api.post('community/chat_data/',{data : data},{
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


export const postAnalayis = async(token,company)=>{
    try{
        const response = await api.post('analysis/analysis/',{company},{
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

export const postWatchList = async(token,company)=>{
    try{
        const response = await api.post('analysis/watchlist/',{company},{
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

export const getWatchList = async(token)=>{
    try{
        const response = await api.get('analysis/watchlist',{
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