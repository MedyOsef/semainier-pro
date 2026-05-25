import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function randomColor(): string {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 60 + Math.floor(Math.random() * 20); // 60-79
  const lightness = 45 + Math.floor(Math.random() * 10); // 45-54

  const h = hue / 360;
  const s = saturation / 100;
  const l = lightness / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hh = h * 6;
  const x = c * (1 - Math.abs((hh % 2) - 1));
  let r1 = 0, g1 = 0, b1 = 0;
  if (hh >= 0 && hh < 1) { r1 = c; g1 = x; b1 = 0; }
  else if (hh < 2) { r1 = x; g1 = c; b1 = 0; }
  else if (hh < 3) { r1 = 0; g1 = c; b1 = x; }
  else if (hh < 4) { r1 = 0; g1 = x; b1 = c; }
  else if (hh < 5) { r1 = x; g1 = 0; b1 = c; }
  else { r1 = c; g1 = 0; b1 = x; }

  const m = l - c / 2;
  const r = Math.round((r1 + m) * 255);
  const g = Math.round((g1 + m) * 255);
  const b = Math.round((b1 + m) * 255);

  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}
