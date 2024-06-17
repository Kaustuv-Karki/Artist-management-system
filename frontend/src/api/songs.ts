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