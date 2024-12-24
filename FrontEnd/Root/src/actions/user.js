import axios from "axios";

import store from '../redux/store';

const baseURL = "http://127.0.0.1:8000/"

const api = axios.create({
    baseURL,
  });
  
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
        console.log(response);
        return response
    }
    catch(error){
        return error.response
    }
}