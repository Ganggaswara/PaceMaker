import axios from "axios";

// const token = localStorage.getItem("token");
const token = "6|nyDFVgBR7o7So8Ahcjri5wHL8N6vHLjEByN8dW9xd26e8489";
const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    Accept: "application/json",
    Authorization: 'Bearer ' + token,
  },
});

export default apiClient;
