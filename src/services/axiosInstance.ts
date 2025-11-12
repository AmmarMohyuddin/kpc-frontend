import axios from 'axios';
let token: any = localStorage.getItem('auth-token');
axios.defaults.headers.common['uuid'] = token;
axios.defaults.headers.common['Authorization'] = token;
//axios.defaults.baseURL = 'http://130.61.114.96';
 axios.defaults.baseURL = 'https://kpc-digital.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';
let axiosInstance = axios;
export default axiosInstance;
