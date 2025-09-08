// src/services/itemApi.ts
import axios, { AxiosResponse } from "axios";

const API_BASE_URL = "http://localhost:8080/api/itemMaster";

export interface Item {
  id: string;
  itemName: string;
  description: string;
}

// itemApi.ts
export const fetchItems = async (): Promise<Item[]> => {
  const response = await fetch("http://localhost:8080/api/itemMaster"); // ✅ fixed
  if (!response.ok) {
    throw new Error("Failed to fetch items");
  }
  const data = await response.json();
  return data;
};

export const fetchItemById = async (id: string): Promise<Item> => {
  const response: AxiosResponse<Item> = await axios.get(
    `${API_BASE_URL}/${id}`
  );
  return response.data;
};

export const createItem = async (item: Omit<Item, "id">): Promise<void> => {
  await axios.post(API_BASE_URL, item);
};

export const updateItem = async (
  id: string,
  item: Omit<Item, "id">
): Promise<void> => {
  await axios.put(`${API_BASE_URL}/${id}`, item);
};

export const deleteItem = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};
