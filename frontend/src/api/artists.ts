import axios from "axios";

export const getArtists = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/artist/');
        return response.data;
    }
    catch (error) {
        console.error(error);
    }
}