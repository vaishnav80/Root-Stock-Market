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


export const getWallet = async(token)=>{
    try {
        const response = await api.get('wallet/wallet_data',{
            headers: {
                Authorization: `Bearer ${token}`, 
              },
        })
        return response
        
    } catch (error) {
        console.log(error);
        
    }
   
}

export const getTransaction = async(token)=>{
  try {
      const response = await api.get('wallet/transaction/',{
          headers: {
              Authorization: `Bearer ${token}`, 
            },
      })
      return response
      
  } catch (error) {
      console.log(error);
      
  }
 
}

export const postWallet = async(token,amount)=>{
  try {
      const response = await api.post('wallet/wallet_data/',{amount},{
          headers: {
              Authorization: `Bearer ${token}`, 
            },
      })
      return response
      
  } catch (error) {
      console.log(error);
      
  }
 
}


export const getChatAdmin = async(token)=>{
  try {
      const response = await api.get('contactus/chat/',{
          headers: {
              Authorization: `Bearer ${token}`, 
            },
      })
      return response
      
  } catch (error) {
      console.log(error);
      
  }
 
}