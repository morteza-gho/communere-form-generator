// FormEditor.test.tsx
import { describe, it, expect } from "vitest";
import { FormEditor } from "../components/FormEditor";
import { renderWithProviders, screen, fireEvent } from "../utils/test-utils";


describe("FormEditor", () => {
  it("can create a new form", () => {
    renderWithProviders(<FormEditor />);
    fireEvent.change(screen.getByLabelText(/Form name/i), { target: { value: "My Form" } });
    fireEvent.click(screen.getByRole("button", { name: /Create/i }));

    expect(require("../stores/formsStore").useFormsStore().createForm).toHaveBeenCalled();
  });

  it("shows delete button when selectedFormId exists", () => {
    const { useFormsStore } = require("../stores/formsStore");
    useFormsStore().selectedFormId = "123";
    useFormsStore().forms = [{ id: "123", name: "Form A", elements: [] }];

    renderWithProviders(<FormEditor />);
    expect(screen.getByRole("button", { name: /Delete/i })).toBeInTheDocument();
  });
});
