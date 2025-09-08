// // tests/Login.test.tsx
// import { render, screen, fireEvent } from "@testing-library/react";
// import { describe, it, expect, vi } from "vitest";
// import Login from "../components/Login/Login"

// // Mocking useLogin hook
// vi.mock("../../hooks/useLogin", () => ({
//   default: () => ({
//     mutate: vi.fn()
//   })
// }));

// describe("Login Component", () => {
//   it("shows dialog if fields are empty", () => {
//     render(<Login/>);
//     const submitButton = screen.getByText(/sign in/i);
//     fireEvent.click(submitButton);

//     expect(
//       screen.getByText(/please fill in both email and password/i)
//     ).toBeInTheDocument();
//   });

//   it("calls loginMutation.mutate with valid data", () => {
//     const mutateMock = vi.fn();
//     vi.spyOn(useLoginHook, "default").mockReturnValue({ mutate: mutateMock });

//     render(<Login />);

//     const emailInput = screen.getByPlaceholderText("you@example.com");
//     const passwordInput = screen.getByPlaceholderText("Enter your password");
//     const submitButton = screen.getByText(/sign in/i);

//     fireEvent.change(emailInput, { target: { value: "test@example.com" } });
//     fireEvent.change(passwordInput, { target: { value: "password123" } });
//     fireEvent.click(submitButton);

//     expect(mutateMock).toHaveBeenCalledWith({
//       Email: "test@example.com",
//       Password: "password123",
//     });
//   });
// });
