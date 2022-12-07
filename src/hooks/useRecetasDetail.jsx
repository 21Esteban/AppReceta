import { useNavigation } from "@react-navigation/native"
import axios from "axios"
import { useEffect, useState } from "react"


export const RecipeDetailScreen=(recetas)=>{

    const navigation = useNavigation()
    const uri = item.imgUrl
    const [isLoading,setIsLoading]=useState(true)
    const [movieFull,setMovieFull]=useState({
        genres:[]
    })
    const [cast,setCast]=useState([])
  
    const getMoreDetails=async()=>{
  
      try {
        setIsLoading(true)
        const movieFull=await axios.get(`/${id}`)
  
        setMovieFull(movieFull.data);
        setCast(cast.data.cast)
        setIsLoading(false)
  
      } catch (error) {
        setIsLoading(false)
        console.log("Error en getMoreDetails",error.message)
      }
    }
  
    useEffect(()=>{
      getMoreDetails()
    },[])

    return{isLoading,movieFull}
}