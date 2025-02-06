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

export const upsert = async (url: string, data: { id: string | number }) => {
  const target = `${process.env.NEXT_PUBLIC_API}${url}/${data.id}`
  try {
    await axios.head(target)
    // If HEAD succeeds, the doc exists:
    return put(`${url}/${data.id}`, data)
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status !== 404) {
      throw err
    }
    // If HEAD fails with 404, doc doesn't exist:
    return post(url + "/", data)
  }
}