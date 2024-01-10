import axios from "axios";

export const http =  axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-type": "application/json"
  }
});

export const media_upload =  axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

export default http;