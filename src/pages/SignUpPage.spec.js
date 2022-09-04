import SignUpPage from "./SignUpPage.vue";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { render, screen } from "@testing-library/vue";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

describe("Sign Up Page", () => {
  describe("Layout", () => {
    it("has Sign Up Header", () => {
      render(SignUpPage);
      const header = screen.queryByRole("heading", { name: "Sign Up" });
      expect(header).toBeInTheDocument();
    });
    it("has username input", () => {
      render(SignUpPage);
      const input = screen.queryByLabelText("Username");
      expect(input).toBeInTheDocument();
    });

    it("has email input", () => {
      render(SignUpPage);
      const input = screen.queryByLabelText("E-mail");
      expect(input).toBeInTheDocument();
    });
    it("has password input", () => {
      render(SignUpPage);
      const input = screen.queryByLabelText("Password");
      expect(input).toBeInTheDocument();
    });
    it("has password type for password input", () => {
      render(SignUpPage);
      const input = screen.queryByLabelText("Password");
      expect(input.type).toBe("password");
    });
    it("has password Repeat input", () => {
      render(SignUpPage);
      const input = screen.queryByLabelText("Password Repeat");
      expect(input).toBeInTheDocument();
    });
    it("has password Repeat type for password input", () => {
      render(SignUpPage);
      const input = screen.queryByLabelText("Password Repeat");
      expect(input.type).toBe("password");
    });
    it("has Sign Up button", () => {
      render(SignUpPage);
      const button = screen.queryByRole("button", { name: "Sign Up" });
      expect(button).toBeInTheDocument();
    });
    it("disables the button initially", () => {
      render(SignUpPage);
      const button = screen.queryByRole("button", { name: "Sign Up" });
      expect(button).toBeDisabled();
    });
  });
  describe("Interactions", () => {
    it("enables the button when the password and password repeat fields have same value", async () => {
      render(SignUpPage);

      const passwordInput = screen.queryByLabelText("Password");
      const passwordInutRepeat = screen.queryByLabelText("Password Repeat");

      await userEvent.type(passwordInput, "P4ssword");
      await userEvent.type(passwordInutRepeat, "P4ssword");

      const button = screen.queryByRole("button", { name: "Sign Up" });

      expect(button).toBeEnabled();
    });
    it("sends username, email and password to backend after clicking the button", async () => {
      let requestBody;
      const server = setupServer(
        rest.post("/api/1.0/users", async (req, res, ctx) => {
          requestBody = await req.json();
          return res(ctx.status(200));
        })
      );
      server.listen();
      render(SignUpPage);
      const usernameInput = screen.queryByLabelText("Username");
      const emailInput = screen.queryByLabelText("E-mail");
      const passwordInput = screen.queryByLabelText("Password");
      const passwordInutRepeat = screen.queryByLabelText("Password Repeat");
      await userEvent.type(usernameInput, "User1");
      await userEvent.type(emailInput, "user1@mail.com");
      await userEvent.type(passwordInput, "P4ssword");
      await userEvent.type(passwordInutRepeat, "P4ssword");
      const button = screen.queryByRole("button", { name: "Sign Up" });
      // const mockFn = jest.fn();
      // window.fetch = mockFn;
      await userEvent.click(button);
      server.close();
      // const [firstCall] = mockFn.mock.calls;
      // const body = JSON.parse(firstCall[1].body);

      expect(requestBody).toEqual({
        username: "User1",
        email: "user1@mail.com",
        password: "P4ssword",
      });
    });
  });
});
