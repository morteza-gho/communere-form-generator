import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import { beforeEach, vi, type Mock } from "vitest";
import type { Form } from "../types/general";

// ----------------- Mock store -----------------
export const mockStore: {
  forms: Form[];
  selectedFormId: string | null;
  getFormById: Mock<(id: string) => Form | undefined>;
  createForm: Mock<() => void>;
  updateForm: Mock<() => void>;
  deleteForm: Mock<() => void>;
  setSelectedFormId: Mock<(id: string | null) => void>;
} = {
  forms: [],
  selectedFormId: null,
  getFormById: vi.fn(),
  createForm: vi.fn(),
  updateForm: vi.fn(),
  deleteForm: vi.fn(),
  setSelectedFormId: vi.fn(),
};


// reset mocks before each test
beforeEach(() => {
  mockStore.getFormById.mockReset();
  mockStore.createForm.mockReset();
  mockStore.updateForm.mockReset();
  mockStore.deleteForm.mockReset();
  mockStore.setSelectedFormId.mockReset();
})

// ----------------- Mock hook -----------------
vi.mock("../stores/formsStore", () => ({
  useFormsStore: () => mockStore,
}));

// ----------------- Utility render -----------------
export const renderWithProviders = (ui: ReactNode) => render(ui);

// ----------------- Re-export everything from RTL -----------------
export * from "@testing-library/react";
