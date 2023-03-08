import React from "react";
import { legacy_createStore as createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import App from "./App";
import rootReducers from "./reducers";
import { act } from "react-dom/test-utils";

jest.mock("react-dom", () => ({
  createRoot: jest.fn().mockReturnValue({
    render: jest.fn(),
  }),
}));

describe("index.js", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the app component", () => {
    const store = createStore(rootReducers, applyMiddleware(thunk));
    act(() => {
      render(
        <Provider store={store}>
          <App />
        </Provider>
      );
    });

    expect(ReactDOM.createRoot).toHaveBeenCalledTimes(1);
    expect(ReactDOM.createRoot).toHaveBeenCalledWith(
      document.getElementById("root")
    );
    expect(root.render).toHaveBeenCalledTimes(1);
    expect(root.render).toHaveBeenCalledWith(
      <React.StrictMode>
        <Provider store={store}>
          <App />
        </Provider>
      </React.StrictMode>
    );
  });
});

describe("Test render app", () => {
  test("renders learn react link", () => {
    render(<App />);
    // const linkElement = screen.getByText(/learn react/i);
    // expect(linkElement).toBeInTheDocument();
  });
});
