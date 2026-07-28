import axios from "axios";

const API = axios.create({
  baseURL: "https://api.getcoredispatch.cloud",
  timeout: 10000,
});

export default API;