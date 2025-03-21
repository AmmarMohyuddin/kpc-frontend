import axiosInstance from './axiosInstance';
import { jwtDecode } from 'jwt-decode';

class APIService {
  // Use async/await for cleaner async operations
  async get(url: string, data: any) {
    try {
      const response = await axiosInstance.get(url, { params: data });
      return response.data; // Ensure returning data
    } catch (error: any) {
      throw error.response ? error.response.data : new Error("API request failed");
    }
  }

  async post(url: string, data: any) {
    try {
      const response = await axiosInstance.post(url, data);
      return response.data;
    } catch (error: any) {
      throw error.response ? error.response.data : new Error("API request failed");
    }
  }

  async put(url: string, data: any) {
    try {
      const response = await axiosInstance.put(url, data);
      return response.data;
    } catch (error: any) {
      throw error.response ? error.response.data : new Error("API request failed");
    }
  }

  async delete(url: string) {
    try {
      const response = await axiosInstance.delete(url);
      return response.data;
    } catch (error: any) {
      throw error.response ? error.response.data : new Error("API request failed");
    }
  }

  isLoggedIn() {
    return localStorage.getItem('jwt_access_token') ? true : false;
  }

  getLoggedInUser(jwt: string) {
    try {
      return jwtDecode(jwt);
    } catch (ex) {
      return null;
    }
  }
}

const apiService = new APIService();
export default apiService;
