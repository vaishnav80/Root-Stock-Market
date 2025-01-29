import axios from "axios";

import store from '../redux/store';
import { logout } from "../redux/authSlice";

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


export const order = async (token,company,price,quantity)=>{
   try {
        console.log(token,price,quantity,company);
        
            const response = await api.post('order/order_data/',{
                company,price,quantity,action
            },{
            headers :{
                Authorization:`Bearer ${token}`
            },
            timeout: 5000
        })
        return response

   } catch (error) {
        console.log('error')
   }
   
}
export const sellOrder = async (token,company,price,quantity)=>{
    try {
        console.log('selll');
        
             const response = await api.put('order/order_data/',{
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
             const response = await api.get('order/order_data/',{
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
        
        const response = await api.get('order/invest/',{
            headers :{
                Authorization : `Bearer ${token}`
            }
        })
        return response
    } catch (error) {
        return error
    }
 }