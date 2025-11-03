import axios from "axios";

// ✅ Create Axios instance with environment-based URL
const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`, // uses .env + '/api'
});

// ✅ Automatically attach JWT token (if available in localStorage)
API.interceptors.request.use((req) => {
  const user = localStorage.getItem("user");
  if (user) {
    const { token } = JSON.parse(user);
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
