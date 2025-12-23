/**
 * Toast notification store.
 */

import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastState {
    toasts: Toast[];
    addToast: (type: ToastType, message: string, duration?: number) => void;
    removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
    toasts: [],

    addToast: (type, message, duration = 5000) => {
        const id = Math.random().toString(36).substring(2, 9);
        const toast: Toast = { id, type, message, duration };

        set((state) => ({
            toasts: [...state.toasts, toast],
        }));

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                set((state) => ({
                    toasts: state.toasts.filter((t) => t.id !== id),
                }));
            }, duration);
        }
    },

    removeToast: (id) => {
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        }));
    },
}));

// Helper hooks
export const useToast = () => {
    const addToast = useToastStore((state) => state.addToast);

    return {
        success: (message: string) => addToast('success', message),
        error: (message: string) => addToast('error', message),
        warning: (message: string) => addToast('warning', message),
        info: (message: string) => addToast('info', message),
    };
};
