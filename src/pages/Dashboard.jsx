import { useAuth } from "../context/AuthContext"
import { getAllCategories } from "../services/category"
import { useEffect,useState } from "react"
import { Link } from "react-router"

function Dashboard({ }) {
  const {user} = useAuth()
  const [category, setCategory]= useState([])

   
    async function loadAllCategories(){
      try{
        const response= await getAllCategories()
        setCategory(response)
      }catch(err){console.log(err)}
    }
   useEffect(()=>{
    loadAllCategories()
  },[])
  return (
    <div>
        <h1>Welcome {user.username}</h1>
        {category.map((one)=>(<div key={one._id} className="category">
          <Link to={`/category/${one._id}`}>{one.name}</Link>
        </div>))}

    </div>
  )
}

export default Dashboard