import api from "./api";
import axios from "axios";

async function createRequest(body){
    const response = await api.post('/requests', body)
    return response.data
}

async function getAllRequests(){
    const response= await api.get('/requests')
    return response.data
}

export{createRequest, getAllRequests}