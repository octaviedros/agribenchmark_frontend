// a helper function to get/post/push/delete data from/to the server
import axios from 'axios';

export const get = async (url: string) => {
  const response = await axios.get(process.env.NEXT_PUBLIC_API + url);
  return response.data;
};

export const post = async (url: string, data: object) => {
  const response = await axios.post(process.env.NEXT_PUBLIC_API + url, data);
  return response.data;
};

export const put = async (url: string, data: object) => {
  const response = await axios.put(process.env.NEXT_PUBLIC_API + url, data);
  return response.data;
};

export const del = async (url: string) => {
  const response = await axios.delete(process.env.NEXT_PUBLIC_API + url);
  return response.data;
}