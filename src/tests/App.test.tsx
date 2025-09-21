// App.test.tsx
import { renderWithProviders, screen, mockStore } from "../utils/test-utils";
import App from "../App";
import { describe, expect, it } from "vitest";

describe("App", () => {
  it("renders FormRenderer when currentForm exists", () => {
    const mockForm = { id: "1", name: "Test Form", elements: [] };

    mockStore.forms = [mockForm];
    mockStore.getFormById.mockReturnValue(mockForm);

    renderWithProviders(<App />);
    expect(screen.getByText(/Test Form/i)).toBeInTheDocument();
  });
});
