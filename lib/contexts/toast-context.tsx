"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    const id = Date.now().toString();
    const toast: Toast = { id, message, type };
    setToasts((prev) => [...prev, toast]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-3 rounded-lg shadow-lg transform transition-all duration-300 border-l-4 ${
              toast.type === "success"
                ? "bg-green-50 text-green-800 border-green-500"
                : toast.type === "error"
                ? "bg-red-50 text-red-800 border-red-500"
                : "bg-blue-50 text-blue-800 border-blue-500"
            }`}
          >
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium pr-2">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className={`text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ${
                  toast.type === "success"
                    ? "hover:text-green-600"
                    : toast.type === "error"
                    ? "hover:text-red-600"
                    : "hover:text-blue-600"
                }`}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}