import Axios from "axios";
const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // withCredentials: true,
});

axios.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error.response.data)
);

export default axios;
