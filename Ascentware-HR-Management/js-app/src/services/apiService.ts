import api from "../utils/api";

// Generic GET request
export const getData = async <T>(endpoint: string): Promise<T> => {
  try {
    const response = await api.get<T>(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

// Generic POST request
export const postData = async <T, D>(endpoint: string, data: D): Promise<T> => {
  try {
    const response = await api.post<T>(endpoint, data);
    return response.data;
  } catch (error) {
    console.error(`Error posting data to ${endpoint}:`, error);
    throw error;
  }
};

// Generic PUT request
export const putData = async <T, D>(endpoint: string, data: D): Promise<T> => {
  try {
    const response = await api.put<T>(endpoint, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating data at ${endpoint}:`, error);
    throw error;
  }
};

// Generic DELETE request
export const deleteData = async (endpoint: string): Promise<void> => {
  try {
    await api.delete(endpoint);
  } catch (error) {
    console.error(`Error deleting data at ${endpoint}:`, error);
    throw error;
  }
};
