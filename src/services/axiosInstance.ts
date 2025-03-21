import axios from 'axios';
let token: any = localStorage.getItem('auth-token');
axios.defaults.headers.common['uuid'] = token;
axios.defaults.headers.common['Authorization'] = token;
axios.defaults.baseURL = 'http://localhost:8000';
// axios.defaults.baseURL = 'https://babtainnotify.com:81';
axios.defaults.headers.post['Content-Type'] = 'application/json';
let axiosInstance = axios;
export default axiosInstance;
