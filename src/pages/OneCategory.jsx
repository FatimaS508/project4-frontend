import React from 'react'
import { useEffect, useState } from "react";
import { getOneCategory } from "../services/category";
import {useParams, useNavigate} from "react-router" 


function OneCategory() {
   const { categoryId } = useParams();
   const navigate = useNavigate();
   const [sCategory, setsCategory]= useState(null)

   async function loadScategory(){
    try{
        const response= await getOneCategory(categoryId)
        setsCategory(response)
    }catch(err){console.log(err)}
   }

   useEffect(()=>{
    loadScategory()
   },[categoryId])
  return (
    <div>
        {sCategory && (<>
         <h3>subcategories</h3>
        <h2>{sCategory.name}</h2>

        {sCategory.subcategories.map((one)=>(<div key={one._id} className='sCategory'>
            <h3>{one.name}</h3>
            <p>{one.about}</p>
            <button onClick={() => navigate(`/request/${one._id}`)}>Request</button>
            {console.log("Category ID:", sCategory._id)}
{console.log("Subcategory ID:", one._id)}
        </div>))}
        
        </>)}
       
    </div>
  )
}

export default OneCategory

