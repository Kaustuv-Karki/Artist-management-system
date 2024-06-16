import axios from 'axios';
export const fetchSongsById = async (id: string) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/music/artist/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}