import axios from "axios";
export async function login(credentials) {
  try {
    const response = await axios.post("", credentials);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Login failed");
  }
}
