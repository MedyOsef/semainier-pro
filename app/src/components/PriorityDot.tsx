import { PRIO_COLORS } from '@/types';
import type { Priority } from '@/types';

interface Props {
  priority: Priority;
  showLabel?: boolean;
}

export function PriorityDot({ priority, showLabel = false }: Props) {
  const color = PRIO_COLORS[priority];
  return (
    <span className="inline-flex items-center gap-1.5" title={priority}>
      <span className="w-2 h-2 rounded-full inline-block" style={{ background: color }} />
      {showLabel && <span className="text-xs" style={{ color }}>{priority}</span>}
    </span>
  );
}
