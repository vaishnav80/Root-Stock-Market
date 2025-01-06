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