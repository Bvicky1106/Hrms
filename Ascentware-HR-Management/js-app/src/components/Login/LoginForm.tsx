// import { LABELS } from "../../constants";
// import logo from "../../assets/ascentware.png";

// interface LoginFormProps {
//   handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
//   handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
//   errors?: {
//     Email?: string;
//     Password?: string;
//   };
//   formData: {
//     Email: string;
//     Password: string;
//   };
// }

// function LoginForm({
//   handleChange,
//   handleSubmit,
//   errors = {},
//   formData,
// }: LoginFormProps) {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300 px-4">
//       <form
//         onSubmit={handleSubmit}
//         className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 space-y-6"
//         role="form"
//       >
//         <div className="flex justify-center">
//           <img src={logo} alt="Logo" className="h-28 w-auto" />
//         </div>

//         {/* Email Field */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             {LABELS.EMAIL}
//           </label>
//           <input
//             type="email"
//             name="Email"
//             placeholder="you@example.com"
//             onChange={handleChange}
//             value={formData.Email}
//             className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
//           />
//           {errors.Email && (
//             <p className="text-red-500 text-xs mt-1">{errors.Email}</p>
//           )}
//         </div>

//         {/* Password Field */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             {LABELS.PASSWORD}
//           </label>
//           <input
//             type="password"
//             name="Password"
//             placeholder="Enter your password"
//             onChange={handleChange}
//             value={formData.Password}
//             className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
//           />
//           {errors.Password && (
//             <p className="text-red-500 text-xs mt-1">{errors.Password}</p>
//           )}
//         </div>

//         {/* Forgot Password */}
//         <div className="text-right">
//           <button
//             type="button"
//             className="text-sm text-blue-500 hover:underline"
//           >
//             Forgot Password?
//           </button>
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition duration-200"
//         >
//           Sign In
//         </button>
//       </form>
//     </div>
//   );
// }

// export default LoginForm;
