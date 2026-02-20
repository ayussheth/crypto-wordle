"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  show: boolean;
  onDone?: () => void;
}

export default function Toast({ message, show, onDone }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const t = setTimeout(() => {
        setVisible(false);
        onDone?.();
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [show, message, onDone]);

  if (!visible) return null;

  return (
    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-white text-black px-4 py-2 rounded-lg font-semibold text-sm shadow-lg animate-pop-in">
      {message}
    </div>
  );
}
