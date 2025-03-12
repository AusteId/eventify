import axios from "axios";

const url = "http://localhost:8080/api/users/register";

export const postUserRegistration = async (data) => {
  const response = await axios.post(url, data);

  return response.data;
}