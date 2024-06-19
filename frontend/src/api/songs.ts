import axios from 'axios';
import { toast } from 'react-toastify';

export const fetchSongsById = async (artistId: string) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/music/artist/${artistId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching songs:", error);
        throw error;
    }
}

export const addSong = async (data: any) => {
    try {
        const response = await axios.post(`http://localhost:5000/api/music/`, data);
        toast.success("Song added successfully");
        return response.data;
    } catch (error) {
        toast.error("Error adding song");
        console.error("Error adding song:", error);
        throw error;
    }
}


export const getSongById = async (id: string) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/music/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching song:", error);
        throw error;
    }
}

export const deleteSong = async (id: string) => {
    try {
        const response = await axios.delete(`http://localhost:5000/api/music/${id}`);
        toast.success("Song deleted successfully");
        return response.data;
    } catch (error) {
        toast.error("Error deleting song");
        console.error("Error deleting song:", error);
        throw error;
    }
}


export const updateSong = async (id: string, data: any) => {
    try {
        const response = await axios.put(`http://localhost:5000/api/music/${id}`, data);
        toast.success("Song updated successfully");
        return response.data;
    } catch (error) {
        toast.error("Error updating song");
        console.error("Error updating song:", error);
        throw error;
    }
}