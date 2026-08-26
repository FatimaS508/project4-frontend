import api from "./api.js";
import axios from "axios";

async function getAllCategories(){
    const response = await api.get('/category')
    console.log(response)
    return response.data
    
}

async function getOneCategory(id){
    const response = await api.get(`/category/${id}`)
    return response.data
    console.log(response)
}

async function getOneSubcategory(scategoryId) {
  const response = await api.get(`/category/subcategory/${scategoryId}`)
  return response.data
}

export{getAllCategories, getOneCategory, getOneSubcategory}