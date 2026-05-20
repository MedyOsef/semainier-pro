import { CAT_COLORS } from '@/types';
import type { Category } from '@/types';

interface Props {
  category: Category;
  size?: 'sm' | 'md';
}

export function CategoryBadge({ category, size = 'sm' }: Props) {
  const color = CAT_COLORS[category];
  return (
    <span
      className={`inline-block font-semibold uppercase ${size === 'sm' ? 'text-[10px] px-2 py-0.5 rounded-md' : 'text-xs px-2.5 py-1 rounded-lg'}`}
      style={{ background: `${color}18`, color }}
    >
      {category}
    </span>
  );
}
