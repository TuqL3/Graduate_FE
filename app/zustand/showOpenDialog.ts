import { create } from 'zustand';

interface DialogState {
  isOpen: boolean;
  onOpen: (state: boolean) => void;
  onClose: (state: boolean) => void;
}

export const useOpenDialog = create<DialogState>()((set) => ({
  isOpen: false,
  onOpen: (by) => set((state) => ({ isOpen: by })),
  onClose: (by) => set((state) => ({ isOpen: by })),
}));
