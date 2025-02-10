// // config.js

// const config = {
//   backendUrl: "http://localhost:5555", // Replace with your actual backend URL
// };

// export default config;



import axios from "axios";

export const API_URL = "https://archery-1.onrender.com";

// const jwt = localStorage.getItem("jwt");

export const api = axios.create({
  baseURL: API_URL,
  
}); 