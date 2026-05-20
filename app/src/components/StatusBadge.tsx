import { STATUS_COLORS } from '@/types';
import type { Status } from '@/types';

interface Props {
  status: Status;
}

export function StatusBadge({ status }: Props) {
  const color = STATUS_COLORS[status];
  return (
    <span
      className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase"
      style={{ background: `${color}18`, color }}
    >
      {status}
    </span>
  );
}
