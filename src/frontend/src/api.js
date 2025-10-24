import axios from "axios";

const API = axios.create({ baseURL: "https://moneyminder-3.onrender.com/api" });

// Attach token if logged in
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
