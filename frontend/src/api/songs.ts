import axios from 'axios';

export const fetchSongsById = async (artistId: string) => {
    console.log("Fetch songs called", artistId)
    try {
        const response = await axios.get(`http://localhost:5000/api/music/artist/${artistId}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}