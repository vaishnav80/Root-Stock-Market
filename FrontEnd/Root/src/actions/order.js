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


export const order = async (token,company,price,quantity)=>{
   try {
            const response = api.post('order/order_data/',{
                company,price,quantity
            },{
            headers :{
                Authorization:`Bearer ${token}`
            } 
        })
        return response

   } catch (error) {
    
   }
   
}


export const getorder = async (token)=>{
    try {
             const response = api.get('order/order_data/',{
             headers :{
                 Authorization:`Bearer ${token}`
             } 
         })
         return response
         
    } catch (error) {
        return error
    }
    
 }


 export const investment = async (token) =>{
    try {
        console.log('investment action');
        
        const response = api.get('order/invest/',{
            headers :{
                Authorization : `Bearer ${token}`
            }
        })
        return response
    } catch (error) {
        return error
    }
 }