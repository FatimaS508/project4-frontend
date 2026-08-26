import api from "./api";
import axios from "axios";

async function createRequest(body){
    const response = await api.post('/request', body)
    return response.data
}

export{createRequest}