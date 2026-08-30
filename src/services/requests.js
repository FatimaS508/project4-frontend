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
  const response = await api.get(`/requests/${requestId}`)
  return response.data;
}

async function addReply(requestId, replyData){
    const response= await api.post(`/requests/${requestId}/replies`,replyData)
    return response.data
}
async function updateRequestStatus(requestId, status) {
    const response = await api.put(`/requests/${requestId}`, { status })
    return response.data
}
async function deleteReply(requestId, replyId){
    const response= await api.delete(`/requests/${requestId}/replies/${replyId}`)
    return response.data
}

export{createRequest, getAllRequests, addReply, getOneRequest, updateRequestStatus, deleteReply}