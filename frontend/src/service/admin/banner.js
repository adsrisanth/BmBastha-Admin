import axios from "axios";

const URI = import.meta.env.VITE_URI


export async function fetchBannerList(token){
    try{
        return await axios.get(`${URI}/api/admin/banner/list/all` , 
            {
                headers:{
                    Authorization: token
                }
            }
        )
            .then((result)=>{
                return result.data
            })
            .catch((err)=>{
                return {code: -1 , message: "Unable to connect server"}
            })
    }
    catch(err){
        return {code: -1 , message: "Unable to connect server"}
    }
}


export async function addBannerService(data , token){
    try{
        return await axios.put(`${URI}/api/admin/banner/add` , data ,
            {
                headers:{
                    Authorization: token
                }
            }
        )
            .then((result)=>{
                return result.data
            })
            .catch((err)=>{
                return {code: -1 , message: "Unable to connect server"}
            })
    }
    catch(err){
        return {code: -1 , message: "Unable to connect server"}
    }
}
export async function deleteBannerService(bannerId, token) {
    const response = await axios.delete(`${URI}/api/admin/banner/remove/${bannerId}`, {
        headers: { Authorization: `${token}` },
    });
    return response.data; 
}