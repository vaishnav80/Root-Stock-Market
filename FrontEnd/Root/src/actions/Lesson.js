import axios from "axios";




const baseURL = "http://127.0.0.1:8000/"

const api = axios.create({
    baseURL,
  });


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