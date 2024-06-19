import axios from "axios";
import { toast } from "react-toastify";

export const getArtists = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/artist/');
        return response.data;
    }
    catch (error) {
        console.error(error);
    }
}

export const postArtist = async (data: any) => {
    try {
        const response = await axios.post('http://localhost:5000/api/artist/', data);
        toast.success('Artist Created Successfully');
        return response.data;
    }
    catch (error) {
        toast.error('Artist Creation Failed');
        console.error(error);
    }
}

export const getArtistById = async (id: string) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/artist/${id}`);
        return response.data;
    }
    catch (error) {
        console.error(error);
    }
}



export const deleteArtist = async (id: string) => {
    try {
        const response = await axios.delete(`http://localhost:5000/api/artist/${id}`);
        toast.success('Artist Deleted Successfully');
        return response.data;
    }
    catch (error) {
        if(error.response.data.code === "23503"){
            toast.error('Artist is associated with a song');
        } 
            toast.error('Artist Deletion Failed');
        
    }
}


export const importArtist   = async () => {
    try {
        const response = await axios.get(`http://localhost:5000/api/artist/download`);
        toast.success('Artist Imported Successfully');
        return response.data;
    }
    catch (error) {
        toast.error('Artist Import Failed');
        console.error(error);
    }
}