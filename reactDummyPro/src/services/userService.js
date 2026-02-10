import axios from "axios";

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 8000
});

export const fetchUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};
