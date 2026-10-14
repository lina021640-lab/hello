/** 날짜는 'YYYY-MM-DD' 문자열로 다룬다 (시간대 영향 없음). */
export const pad2 = (n: number) => String(n).padStart(2, '0');
export const iso = (y: number, m: number, d: number) => `${y}-${pad2(m)}-${pad2(d)}`;
export const parse = (s: string) => { const [y, m, d] = s.split('-').map(Number); return { y, m, d }; };
export const dayNum = (s: string) => { const { y, m, d } = parse(s); return Math.round(Date.UTC(y, m - 1, d) / 86400000); };
export const diffDays = (a: string, b: string) => dayNum(b) - dayNum(a);
export const inclusive = (a: string, b: string) => diffDays(a, b) + 1;
export const fmt = (s: string) => s.replace(/-/g, '.');
export const fmtShort = (s: string) => `${pad2(parse(s).m)}.${pad2(parse(s).d)}`;
export const daysInMonth = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();
export const firstDow = (y: number, m: number) => new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
export const todayIso = () => { const d = new Date(); return iso(d.getFullYear(), d.getMonth() + 1, d.getDate()); };
