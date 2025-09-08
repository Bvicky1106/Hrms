import { useMutation } from "@tanstack/react-query";
import { postData } from "../services";
import { LoginFormData } from "../types";

function useLogin() {
  return useMutation({
    mutationFn: (data: LoginFormData) => {
      return postData("/api-dev/login", data);
    },
  });
}

export default useLogin;
