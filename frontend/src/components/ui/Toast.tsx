import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useToastStore, type Toast } from '@/stores/toastStore';
import { cn } from '@/utils/cn';

const toastIcons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
};

const toastStyles = {
    success: 'bg-green-500/10 border-green-500/30 text-green-400',
    error: 'bg-red-500/10 border-red-500/30 text-red-400',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
};

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
    const removeToast = useToastStore((state) => state.removeToast);
    const Icon = toastIcons[toast.type];

    return (
        <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-xl shadow-xl min-w-[300px] max-w-[400px]',
                toastStyles[toast.type]
            )}
        >
            <Icon className="w-5 h-5 shrink-0" />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
};

export const ToastContainer: React.FC = () => {
    const toasts = useToastStore((state) => state.toasts);

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ToastContainer;
