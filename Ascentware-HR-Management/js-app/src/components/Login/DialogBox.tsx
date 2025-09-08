// interface DialogBoxProps {
//   isOpen: boolean;
//   message: string;
//   onClose: () => void;
// }

// const DialogBox = ({ isOpen, message, onClose }: DialogBoxProps) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex justify-center items-center">
//       <div className="bg-white rounded-xl shadow-xl p-6 w-80 text-center">
//         <p className="text-gray-800 mb-4">{message}</p>
//         <button
//           onClick={onClose}
//           className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
//         >
//           OK
//         </button>
//       </div>
//     </div>
//   );
// };

// export default DialogBox;
