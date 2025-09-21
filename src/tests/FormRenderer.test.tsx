// FormRenderer.test.tsx
import { FormRenderer } from "../components/FormRenderer";
import type { Form } from "../types/general";
import { fireEvent, renderWithProviders, screen } from "../utils/test-utils";

import { describe, expect, it, vi } from "vitest";

const form: Form = {
  id: "1",
  name: "Login",
  elements: [
    { id: "username", type: "text", label: "Username", isRequired: true },
    { id: "remember", type: "checkbox", label: "Remember Me", isRequired: false },
  ],
};

describe("FormRenderer", () => {
  it("renders fields", () => {
    renderWithProviders(<FormRenderer form={form} onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Remember Me/i)).toBeInTheDocument();
  });

  it("calls onSubmit with values", async () => {
    const onSubmit = vi.fn();
    renderWithProviders(<FormRenderer form={form} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "john" } });
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    expect(onSubmit).toHaveBeenCalledWith({ username: "john", remember: false });
  });
});
