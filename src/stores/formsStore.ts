import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Form } from '../types/general';

interface FormsState {
  forms: Form[];
  selectedFormId: string | null;
  setSelectedFormId: (id: string | null) => void;
  createForm: (form: Form) => void;
  updateForm: (form: Form) => void;
  deleteForm: (id: string) => void;
  getFormById: (id: string) => Form | undefined;
  clearAll: () => void;
}

export const useFormsStore = create<FormsState>()(
  persist(
    (set, get) => ({
      forms: [],
      selectedFormId: null,
      setSelectedFormId: (id: string | null) => set({ selectedFormId: id }),
      createForm: (form) =>
        set((s) => ({ forms: [...s.forms, form] })),
      updateForm: (form) =>
        set((s) => ({ forms: s.forms.map((f) => (f.id === form.id ? form : f)) })),
      deleteForm: (id) =>
        set((s) => ({ forms: s.forms.filter((f) => f.id !== id) })),
      getFormById: (id) => get().forms.find((f) => f.id === id),
      clearAll: () => set({ forms: [] })
    }),
    {
      name: 'forms-storage-v1'
    }
  )
);
