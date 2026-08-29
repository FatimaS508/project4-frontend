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
async function getOneRequest(requestId) {
  const response = await api.get(`/requests/${requestId}`);
  return response.data;
}

async function addReply(requestId, replyData){
    const response= await api.post(`/requests/${requestId}/replies`,replyData)
    return response.data
}

export{createRequest, getAllRequests, addReply, getOneRequest}