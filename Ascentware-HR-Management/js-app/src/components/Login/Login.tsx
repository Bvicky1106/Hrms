// import { useState } from "react";
// import LoginForm from "./LoginForm";
// import useLogin from "../../hooks/useLogin";
// import { LoginFormData } from "../../types";
// import DialogBox from "./DialogBox"; // 👈 import DialogBox
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const [formData, setFormData] = useState<LoginFormData>({
//     Email: "",
//     Password: "",
//   });
//   const navigate = useNavigate();

//   const [errors, setErrors] = useState<{ Email?: string; Password?: string }>(
//     {}
//   );

//   const [dialog, setDialog] = useState<{ isOpen: boolean; message: string }>({
//     isOpen: false,
//     message: "",
//   });

//   const loginMutation = useLogin();

//   const validateEmail = (email: string) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (email.length < 5) return "Email must be at least 5 characters.";
//     if (email.length > 30) return "Email must not exceed 30 characters.";
//     if (!emailRegex.test(email)) return "Please enter a valid email address.";
//     return "";
//   };

//   const validatePassword = (password: string) => {
//     if (!password.trim()) return "Password is required.";
//     return "";
//   };

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = event.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));

//     if (name === "Email") {
//       setErrors((prev) => ({ ...prev, Email: validateEmail(value) }));
//     } else if (name === "Password") {
//       setErrors((prev) => ({ ...prev, Password: validatePassword(value) }));
//     }
//   };

//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     const emailError = validateEmail(formData.Email);
//     const passwordError = validatePassword(formData.Password);

//     if (emailError || passwordError) {
//       setErrors({ Email: emailError, Password: passwordError });
//       return;
//     }

//     setErrors({});
//     loginMutation.mutate(formData, {
//       onSuccess: () => {
//         setDialog({
//           isOpen: true,
//           message: "Login successful!",
//         });
//         setFormData({ Email: "", Password: "" });
//         setTimeout(() => {
//           navigate("/home"); //
//         }, 1000);
//       },
//       onError: () => {
//         setDialog({
//           isOpen: true,
//           message: "Login failed. Please try again.",
//         });
//       },
//     });
//     console.log(formData);
//   };

//   return (
//     <>
//       <LoginForm
//         handleChange={handleChange}
//         handleSubmit={handleSubmit}
//         errors={errors}
//         formData={formData}
//       />
//       <DialogBox
//         isOpen={dialog.isOpen}
//         message={dialog.message}
//         onClose={() => setDialog({ isOpen: false, message: "" })}
//       />
//     </>
//   );
// };

// export default Login;
