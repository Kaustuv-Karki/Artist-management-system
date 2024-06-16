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


export const getUserById = async (id: string) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/users/${id}`);
        return response.data;
    }
    catch (error) {
        console.error(error);
    }
}


export const updateUser = async (id: string, data: PostUserRequest) => {
    try {
        const response = await axios.put(`http://localhost:5000/api/users/update/${id}`, data);
        toast.success('User Updated Successfully');
        return response.data;
    }
    catch (error) {
        toast.error('User Update Failed');
        console.error(error);
    }
}

export const deleteUser = async (id: string) => {
    try {
        const response = await axios.delete(`http://localhost:5000/api/users/delete/${id}`);
        toast.success('User Deleted Successfully');
        return response.data;
    }
    catch (error) {
        toast.error('User Deletion Failed');
        console.error(error);
    }
}


