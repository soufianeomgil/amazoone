import { create } from "zustand";

interface ConfirmOptions {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

interface ConfirmState extends ConfirmOptions {
  open: boolean;
  resolve?: (value: boolean) => void;
}

interface ConfirmStore {
  state: ConfirmState;
  confirm: (options?: ConfirmOptions) => Promise<boolean>;
  close: (result: boolean) => void;
}

export const useConfirmStore = create<ConfirmStore>((set) => ({
  state: {
    open: false,
  },

  confirm: (options = {}) =>
    new Promise<boolean>((resolve) => {
      set({
        state: {
          open: true,
          resolve,
          title: options.title ?? "Are you sure?",
          description:
            options.description ??
            "This action cannot be undone.",
          confirmText: options.confirmText ?? "Confirm",
          cancelText: options.cancelText ?? "Cancel",
          destructive: options.destructive ?? true,
        },
      });
    }),

  close: (result) =>
    set((store) => {
      store.state.resolve?.(result);
      return {
        state: { open: false },
      };
    }),
}));
