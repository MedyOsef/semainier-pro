import { ClipboardList } from 'lucide-react';

interface Props {
  message?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ message = 'Aucune donnée', icon }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-[var(--txt2)]">
      {icon || <ClipboardList size={48} style={{ opacity: 0.4 }} />}
      <span className="text-sm">{message}</span>
    </div>
  );
}
