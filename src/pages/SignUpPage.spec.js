import SignUpPage from "./SignUpPage.vue";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { render, screen, waitFor } from "@testing-library/vue";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import i18n from "../locales/i18n";
import en from "../locales/en.json";
import tr from "../locales/tr.json";
import ptBR from "../locales/ptBR.json";
import LanguageSelector from "../components/LanguageSelector.vue";
let requestBody;
let count = 0;
let acceptLanguageHeader;
const server = setupServer(
  rest.post("/api/1.0/users", async (req, res, ctx) => {
    count += 1;
    acceptLanguageHeader = req.headers.get("Accept-Language");
    requestBody = await req.json();
    return res(ctx.status(200));
  })
);
beforeAll(() => server.listen());
beforeEach(() => {
  count = 0;
  server.resetHandlers();
});
afterAll(() => server.close());
describe("Sign Up Page", () => {
  describe("Layout", () => {
    const setup = () => {
      render(SignUpPage, {
        global: {
          plugins: [i18n],
        },
      });
    };
    it("has Sign Up Header", () => {
      setup();
      const header = screen.queryByRole("heading", { name: "Sign Up" });
      expect(header).toBeInTheDocument();
    });
    it("has username input", () => {
      setup();
      const input = screen.queryByLabelText("Username");
      expect(input).toBeInTheDocument();
    });

    it("has email input", () => {
      setup();
      const input = screen.queryByLabelText("E-mail");
      expect(input).toBeInTheDocument();
    });
    it("has password input", () => {
      setup();
      const input = screen.queryByLabelText("Password");
      expect(input).toBeInTheDocument();
    });
    it("has password type for password input", () => {
      setup();
      const input = screen.queryByLabelText("Password");
      expect(input.type).toBe("password");
    });
    it("has password Repeat input", () => {
      setup();
      const input = screen.queryByLabelText("Password Repeat");
      expect(input).toBeInTheDocument();
    });
    it("has password Repeat type for password input", () => {
      setup();
      const input = screen.queryByLabelText("Password Repeat");
      expect(input.type).toBe("password");
    });
    it("has Sign Up button", () => {
      setup();
      const button = screen.queryByRole("button", { name: "Sign Up" });
      expect(button).toBeInTheDocument();
    });
    it("disables the button initially", () => {
      setup();
      const button = screen.queryByRole("button", { name: "Sign Up" });
      expect(button).toBeDisabled();
    });
  });
  describe("Interactions", () => {
    let button, passwordInput, passwordInutRepeat, usernameInput;

    const setup = async () => {
      render(SignUpPage, {
        global: {
          plugins: [i18n],
        },
      });
      usernameInput = screen.queryByLabelText("Username");
      const emailInput = screen.queryByLabelText("E-mail");
      passwordInput = screen.queryByLabelText("Password");
      passwordInutRepeat = screen.queryByLabelText("Password Repeat");
      button = screen.queryByRole("button", { name: "Sign Up" });
      await userEvent.type(usernameInput, "User1");
      await userEvent.type(emailInput, "user1@mail.com");
      await userEvent.type(passwordInput, "P4ssword");
      await userEvent.type(passwordInutRepeat, "P4ssword");
    };
    const generateValidationError = (field, message) => {
      return rest.post("/api/1.0/users", async (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            validationErrors: {
              [field]: message,
            },
          })
        );
      });
    };
    it("enables the button when the password and password repeat fields have same value", async () => {
      await setup();

      expect(button).toBeEnabled();
    });
    it("sends username, email and password to backend after clicking the button", async () => {
      await setup();

      await userEvent.click(button);
      await screen.findByText(
        "Please check your e-mail to activate your account"
      );
      expect(requestBody).toEqual({
        username: "User1",
        email: "user1@mail.com",
        password: "P4ssword",
      });
    });
    it("does not allow clicking to the button when there is an ongoing api call", async () => {
      await setup();
      await userEvent.click(button);
      await userEvent.click(button);
      await screen.findByText(
        "Please check your e-mail to activate your account"
      );
      expect(count).toBe(1);
    });
    it("displays spinner while the api request in progress", async () => {
      let spinner;
      await setup();
      await waitFor(() => {
        userEvent.click(button);
        spinner = screen.queryByRole("status");
        expect(spinner).toBeInTheDocument();
      });
    });
    it("does not display spinner when there is no api request", async () => {
      await setup();
      const spinner = screen.queryByTestId("status");
      expect(spinner).not.toBeInTheDocument();
    });
    it("displays account activation information after successful sign up request", async () => {
      await setup();
      await userEvent.click(button);
      const text = await screen.findByText(
        "Please check your e-mail to activate your account"
      );
      expect(text).toBeInTheDocument();
    });
    it("does not display account activation message before sign up request", async () => {
      await setup();
      userEvent.click(button);
      const text = screen.queryByText(
        "Please check your e-mail to activate your account"
      );

      expect(text).not.toBeInTheDocument();
    });

    it("does not displays account activation information after failing sign up", async () => {
      server.use(generateValidationError());
      await setup();
      await userEvent.click(button);
      const text = screen.queryByText(
        "Please check your e-mail to activate your account"
      );

      expect(text).not.toBeInTheDocument();
    });

    it("hides sign up form after successful sign up request", async () => {
      await setup();
      const form = screen.queryByTestId("form-sign-up");
      await userEvent.click(button);
      await waitFor(() => {
        expect(form).not.toBeInTheDocument();
      });
    });

    it.each`
      field         | message
      ${"username"} | ${"Username cannot be null"}
      ${"email"}    | ${"E-mail cannot be null"}
      ${"password"} | ${"Password cannot be null"}
    `("displays $message  for field $field", async ({ field, message }) => {
      server.use(generateValidationError(field, message));
      await setup();
      userEvent.click(button);
      await screen.findByText(message);
      expect(button).toBeEnabled();
    });

    it("hides spinner after error response received", async () => {
      server.use(
        generateValidationError("username", "Username cannot be null")
      );
      await setup();
      userEvent.click(button);
      await screen.findByText("Username cannot be null");
      const spinner = screen.queryByRole("status");
      expect(spinner).not.toBeInTheDocument();
    });
    it("enables the button after error response reiceved", async () => {
      server.use(
        generateValidationError("username", "Username cannot be null")
      );
      await setup();
      userEvent.click(button);
      await screen.findByText("Username cannot be null");
      expect(button).toBeEnabled();
    });
    it("displays mismatch message for password repeat input", async () => {
      await setup();
      await userEvent.type(passwordInput, "P4ss1");
      await userEvent.type(passwordInutRepeat, "P4ss2");
      const text = await screen.findByText("Password mismatch");
      expect(text).toBeInTheDocument();
    });
    it.each`
      field         | message                      | label
      ${"username"} | ${"Username cannot be null"} | ${"Username"}
      ${"email"}    | ${"E-mail cannot be null"}   | ${"E-mail"}
      ${"password"} | ${"Password cannot be null"} | ${"Password"}
    `(
      "clears validation error after field $field is updated",
      async ({ field, message, label }) => {
        server.use(generateValidationError(field, message));
        await setup();
        userEvent.click(button);
        const text = await screen.findByText(message);
        const input = screen.queryByLabelText(label);
        await userEvent.type(input, "updated");
        expect(text).not.toBeInTheDocument();
      }
    );
  });
  describe("Internationalization", () => {
    let turkishLanguage,
      englishLanguage,
      username,
      email,
      portugeseBRLanguage,
      password,
      button,
      passwordRepeat;
    const setup = () => {
      const app = {
        components: {
          SignUpPage,
          LanguageSelector,
        },
        template: `<SignUpPage/>
        <LanguageSelector />
        `,
      };
      render(app, {
        global: {
          plugins: [i18n],
        },
      });
      turkishLanguage = screen.queryByTitle("Türkçe");
      englishLanguage = screen.queryByTitle("English");
      portugeseBRLanguage = screen.queryByTitle("Portuguese");
      username = screen.queryByLabelText(en.username);
      email = screen.queryByLabelText(en.email);
      password = screen.queryByLabelText(en.password);
      passwordRepeat = screen.queryByLabelText(en.passwordRepeat);
      button = screen.queryByRole("button", { name: en.signUp });
    };
    afterEach(() => (i18n.global.locale = "en"));
    it("intially displays all text in English", () => {
      setup();
      const signUp = screen.queryByRole("heading", { name: en.signUp });
      const username = screen.queryByLabelText(en.username);
      const email = screen.queryByLabelText(en.email);
      const password = screen.queryByLabelText(en.password);
      const passwordRepeat = screen.queryByLabelText(en.passwordRepeat);
      const button = screen.queryByRole("button", { name: en.signUp });
      expect(signUp).toBeInTheDocument();
      expect(username).toBeInTheDocument();
      expect(email).toBeInTheDocument();
      expect(password).toBeInTheDocument();
      expect(passwordRepeat).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });
    it("displays all text in Turkish after selecting that language", async () => {
      setup();

      await userEvent.click(turkishLanguage);
      const signUp = screen.queryByRole("heading", { name: tr.signUp });
      const username = screen.queryByLabelText(tr.username);
      const email = screen.queryByLabelText(tr.email);
      const password = screen.queryByLabelText(tr.password);
      const passwordRepeat = screen.queryByLabelText(tr.passwordRepeat);
      const button = screen.queryByRole("button", { name: tr.signUp });
      expect(signUp).toBeInTheDocument();
      expect(username).toBeInTheDocument();
      expect(email).toBeInTheDocument();
      expect(password).toBeInTheDocument();
      expect(passwordRepeat).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });

    it("displays all text in English after page is translated to turkish", async () => {
      setup();
      await userEvent.click(turkishLanguage);
      await userEvent.click(englishLanguage);
      const signUp = screen.queryByRole("heading", { name: en.signUp });
      const username = screen.queryByLabelText(en.username);
      const email = screen.queryByLabelText(en.email);
      const password = screen.queryByLabelText(en.password);
      const passwordRepeat = screen.queryByLabelText(en.passwordRepeat);
      const button = screen.queryByRole("button", { name: en.signUp });
      expect(signUp).toBeInTheDocument();
      expect(username).toBeInTheDocument();
      expect(email).toBeInTheDocument();
      expect(password).toBeInTheDocument();
      expect(passwordRepeat).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });
    it("displays all text in Portuguese after page is translated to turkish", async () => {
      setup();

      await userEvent.click(turkishLanguage);
      await userEvent.click(portugeseBRLanguage);
      const signUp = screen.queryByRole("heading", { name: ptBR.signUp });
      const username = screen.queryByLabelText(ptBR.username);
      const email = screen.queryByLabelText(ptBR.email);
      const password = screen.queryByLabelText(ptBR.password);
      const passwordRepeat = screen.queryByLabelText(ptBR.passwordRepeat);
      const button = screen.queryByRole("button", { name: ptBR.signUp });
      expect(signUp).toBeInTheDocument();
      expect(username).toBeInTheDocument();
      expect(email).toBeInTheDocument();
      expect(password).toBeInTheDocument();
      expect(passwordRepeat).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });
    it("displays password mismatch validation in Turkish", async () => {
      setup();
      await userEvent.click(turkishLanguage);
      await userEvent.type(password, "P4ssword");
      await userEvent.type(passwordRepeat, "N3wP4ss");
      const validation = screen.queryByText(tr.passwordMismatchValidation);
      expect(validation).toBeInTheDocument();
    });
    it("sends accept-language having en to backend for sign up request", async () => {
      setup();
      await userEvent.type(username, "user1");
      await userEvent.type(email, "user@mail.com");
      await userEvent.type(password, "P4ssword");
      await userEvent.type(passwordRepeat, "P4ssword");
      await userEvent.click(button);
      await screen.findByText(
        "Please check your e-mail to activate your account"
      );
      expect(acceptLanguageHeader).toBe("en");
    });
    it("sends accept-language having tr after that language is selected", async () => {
      setup();
      await userEvent.click(turkishLanguage);
      await userEvent.type(username, "user1");
      await userEvent.type(email, "user@mail.com");
      await userEvent.type(password, "P4ssword");
      await userEvent.type(passwordRepeat, "P4ssword");
      await userEvent.click(button);
      await screen.findByText(tr.accountActivationNotification);

      waitFor(() => {
        expect(acceptLanguageHeader).toBe("tr");
      });
    });
    it("displays account activation information in Turkish after selecting that language", async () => {
      setup();
      await userEvent.click(turkishLanguage);
      await userEvent.type(username, "user1");
      await userEvent.type(email, "user@mail.com");
      await userEvent.type(password, "P4ssword");
      await userEvent.type(passwordRepeat, "P4ssword");
      await userEvent.click(button);
      const accountActivate = await screen.findByText(
        tr.accountActivationNotification
      );
      expect(accountActivate).toBeInTheDocument();
    });
  });
});
