import { useQuery } from "@tanstack/react-query";
import { getData } from "../services";

// Define response type (Adjust based on actual API response)
type TestResponse = {
  message: string;
};

// Custom Hook for fetching `/api/test`
export const useTest = () => {
  return useQuery<TestResponse>({
    queryKey: ["testData"], // Unique key for caching
    queryFn: () => getData<TestResponse>("/api-dev/test"),
  });
};
