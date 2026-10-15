/** 장소 상세 — 저장한 장소 / 공유된 장소 / 검색 예시 결과 중 이름이 같은 것을 합쳐서 보여준다. (하드코딩 데모 없음) */
import { FOUND, useFeed, useSaved } from './savedStore';

export type PlaceTip = { who: string; name: string; text: string };
export type PlaceDetail = {
  n: string; cat: string; city: string; addr: string; e: string; tips: PlaceTip[];
  /** 검색 예시 결과에만 있는 정보 */ rating?: string;
  /** 내 메모 */ note: string; saved: boolean; lat: number | null; lng: number | null;
  /** 이 장소를 공유한 사람 (최신 1건) */ sharedBy?: string; sharedAt?: number;
};

export function usePlace(name?: string): PlaceDetail {
  const sv = useSaved(); const fd = useFeed();
  const n = name || '장소';
  const saved = sv.items.find((x) => x.n === n);
  const shared = fd.items.filter((x) => x.n === n);
  const found = FOUND.find((x) => x.n === n);
  return {
    n,
    cat: saved?.cat ?? shared[0]?.cat ?? found?.cat ?? '장소',
    city: found?.city ?? '',
    addr: saved?.addr || found?.addr || '',
    e: shared[0]?.e ?? '📍',
    tips: shared.filter((x) => x.q).map((x) => ({ who: x.by.slice(0, 1), name: x.by, text: x.q })),
    rating: found?.rating,
    note: saved?.note ?? '',
    saved: !!saved,
    lat: saved?.lat ?? shared[0]?.lat ?? null,
    lng: saved?.lng ?? shared[0]?.lng ?? null,
    sharedBy: shared[0]?.by, sharedAt: shared[0]?.at,
  };
}
