import { render, screen } from "@testing-library/vue";
import App from "./App.vue";
import "@testing-library/jest-dom";
import i18n from "./locales/i18n";

describe("Routing", () => {
  it.each`
    path         | pageTestId
    ${"/"}       | ${"home-page"}
    ${"/signup"} | ${"signup-page"}
    ${"/login"}  | ${"login-page"}
  `("displays $pageTestId when is at $path", ({ path, pageTestId }) => {
    window.history.pushState({}, "", path);
    render(App, {
      global: { plugins: [i18n] },
    });

    const page = screen.queryByTestId(pageTestId);
    expect(page).toBeInTheDocument();
  });

  it.each`
    path         | pageTestId
    ${"/"}       | ${"signup-page"}
    ${"/"}       | ${"login-page"}
    ${"/signup"} | ${"home-page"}
    ${"/signup"} | ${"login-page"}
    ${"/login"}  | ${"home-page"}
    ${"/login"}  | ${"signup-page"}
  `("does not display $pageTestId when is at $path", ({ path, pageTestId }) => {
    window.history.pushState({}, "", path);
    render(App, {
      global: { plugins: [i18n] },
    });

    const page = screen.queryByTestId(pageTestId);
    expect(page).not.toBeInTheDocument();
  });
});
