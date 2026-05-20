import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface Toast {
  id: string;
  msg: string;
  type: 'info' | 'success' | 'error';
}

export function ToastContainer() {
  const { notifications } = useStore();
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[0];
      setToasts((prev) => {
        const next = [{ id: latest.id, msg: latest.msg, type: latest.type }, ...prev].slice(0, 3);
        return next;
      });
    }
  }, [notifications]);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      setToasts((prev) => prev.slice(0, -1));
    }, 4000);
    return () => clearTimeout(timer);
  }, [toasts]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getBorderColor = (type: string) => {
    if (type === 'success') return 'var(--success)';
    if (type === 'error') return 'var(--error)';
    return 'var(--terracotta-mid)';
  };

  const getIcon = (type: string) => {
    if (type === 'success') return <CheckCircle size={16} style={{ color: 'var(--success)' }} />;
    if (type === 'error') return <AlertCircle size={16} style={{ color: 'var(--error)' }} />;
    return <Info size={16} style={{ color: 'var(--terracotta)' }} />;
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-start gap-3 rounded-xl px-4 py-3.5 max-w-[360px] shadow-lg animate-slide-in"
          style={{
            background: 'var(--bg2)',
            border: '1px solid var(--bor)',
            borderLeft: `4px solid ${getBorderColor(toast.type)}`,
          }}
        >
          {getIcon(toast.type)}
          <span className="text-sm flex-1">{toast.msg}</span>
          <button onClick={() => removeToast(toast.id)} className="text-[var(--txt2)] hover:text-[var(--txt)]">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
