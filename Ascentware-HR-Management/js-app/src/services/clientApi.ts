import axios, { AxiosError } from "axios";

const API_URL = "http://localhost:8080/api/companies";

export interface Client {
  id?: string;
  companyName: string;
  contactName: string;
  companyAddress: string;
  companyCountry: string;
  companyPinCode: string; // Note: Backend uses int, but we'll handle as string
  companyEmail: string;
  companyMobileNo: string;
  logoUrl: string;
}

// Helper function to extract error message
const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Unknown error occurred";
    return message;
  }
  return error instanceof Error ? error.message : "Unknown error occurred";
};

// Map frontend Client to backend payload
const toBackendPayload = (client: Omit<Client, "id">): any => ({
  companyName: client.companyName,
  contactName: client.contactName,
  companyAddress: client.companyAddress,
  companyCountry: client.companyCountry,
  companyPinCode: client.companyPinCode, // Backend expects int, API will handle conversion
  companyEmail: client.companyEmail,
  companyMobileNo: client.companyMobileNo,
  logoUrl: client.logoUrl || "", // Handle empty logoUrl
});

// Map backend response to frontend Client
const fromBackendResponse = (data: any): Client => {
  if (!data.id || data.id.trim() === "") {
    console.warn("Client data missing valid id:", data);
  }
  return {
    id: data.id || "", // No longer uses _id
    companyName: data.companyName || "",
    contactName: data.contactName || "",
    companyAddress: data.companyAddress || "",
    companyCountry: data.companyCountry || "",
    companyPinCode: data.companyPinCode?.toString() || "",
    companyEmail: data.companyEmail || "",
    companyMobileNo: data.companyMobileNo || "",
    logoUrl: data.logoUrl || "", // Also change this if backend field is `LogoUrl`
  };
};

// Fetch all clients
export const getClients = async (): Promise<Client[]> => {
  try {
    const response = await axios.get<any[]>(API_URL);

    return response.data.map(fromBackendResponse);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Fetch client by ID
export const getClientById = async (id: string): Promise<Client> => {
  try {
    const response = await axios.get<any>(`${API_URL}/${id}`);

    return fromBackendResponse(response.data);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Create a new client
export const createClient = async (
  client: Omit<Client, "id">
): Promise<Client> => {
  try {
    const payload = toBackendPayload(client);
    const response = await axios.post<any>(API_URL, payload);
    console.log("Create client response:", response.data); // Debug log
    return fromBackendResponse(response.data);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Update a client
export const updateClient = async (
  id: string,
  client: Omit<Client, "id">
): Promise<Client> => {
  try {
    const payload = toBackendPayload(client);
    const response = await axios.put<any>(`${API_URL}/${id}`, payload);
    return fromBackendResponse(response.data);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

// Delete a client
export const deleteClient = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
