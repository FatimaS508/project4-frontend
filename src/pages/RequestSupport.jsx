import React from 'react'
import { useEffect,useState } from 'react'
import { createRequest } from '../services/requests'
import { useNavigate, useParams } from 'react-router'

function RequestSupport() {
    const { categoryId, subcategoryId } = useParams();

    const [formData, setFormData] = useState({
        categoryId: categoryId,
        subcategoryId: subcategoryId,
        priority: "Medium",
        requestDetails: {}
    })

    const navigate = useNavigate()
    function handleChange(event){
    setFormData({...formData, [event.target.name]:event.target.value})
  }

    function handleDetailsChange(event) {
        setFormData({
            ...formData,
            requestDetails: {
                ...formData.requestDetails,
                [event.target.name]: event.target.value
            }
        });
    }

  async function handleSubmit(event){
    event.preventDefault()
    const createdRequest= await createRequest(formData)
    navigate(`/category/${createRequest._id}`)
  }
  return (
      <div>
          <h1>Request Support</h1>

          
      </div>
  )
}

export default RequestSupport