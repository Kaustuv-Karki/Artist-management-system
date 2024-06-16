import { PostUserRequest } from './../../types/postUser.types';
import {toast} from 'react-toastify';
import axios from 'axios';

export const loginUser = async (email: string, password: string) => {
    try {
        const response = await axios.post('http://localhost:5000/api/users/login', {
            email,
            password
        });
        if (response.data.success) {
            toast.success('Login Successful');
        }
        else {
            toast.error('Login Failed');
        }
        return response.data;
    }
    catch (error) {
        toast.error('Login Failed');
        console.error(error);
    }

}

export const postUser = async (data: PostUserRequest) => {
    try {
        const response = await axios.post('http://localhost:5000/api/users/', data);
        toast.success('User Created Successfully');
        return response.data;
    }
    catch (error) {
        toast.error('User Creation Failed');
    }
}


export const getUsers = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/users/');
        return response.data;
    }
    catch (error) {
        console.error(error);
    }
}