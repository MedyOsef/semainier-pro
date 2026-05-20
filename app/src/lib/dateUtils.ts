export const APP_START = (() => {
  const today = new Date();
  return startOfWeek(today);
})();

export const APP_END = (() => {
  const end = new Date(APP_START);
  end.setFullYear(end.getFullYear() + 1);
  return end;
})();

export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function parseKey(k: string): Date {
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function startOfWeek(d: Date): Date {
  const r = new Date(d);
  const day = r.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  r.setDate(r.getDate() + diff);
  r.setHours(0, 0, 0, 0);
  return r;
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function isInRange(d: Date): boolean {
  return d >= APP_START && d <= APP_END;
}

export function formatDate(d: Date, fmt: 'long' | 'short' | 'mini' = 'long'): string {
  const JN = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const MN = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const MC = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  if (fmt === 'long') return `${JN[d.getDay()]} ${d.getDate()} ${MN[d.getMonth()]} ${d.getFullYear()}`;
  if (fmt === 'short') return `${d.getDate()} ${MC[d.getMonth()]}`;
  if (fmt === 'mini') return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
  return dateKey(d);
}

export function getAllWeeks(): Date[] {
  const weeks: Date[] = [];
  let cur = startOfWeek(APP_START);
  const lastWeekStart = startOfWeek(APP_END);
  while (cur <= lastWeekStart) {
    weeks.push(new Date(cur));
    cur = addDays(cur, 7);
  }
  return weeks;
}

export function getInitialWeek(): Date {
  const today = new Date();
  if (today >= APP_START && today <= APP_END) {
    return startOfWeek(today);
  }
  return startOfWeek(APP_START);
}
