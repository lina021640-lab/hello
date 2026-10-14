import { Row } from '../../kit';
import { Chip } from './parts';

/** 정렬 선택: 옵션 2개를 알약 칩으로 나란히 */
export function SortToggle({ options, value, onChange }: { options: readonly string[]; value: number; onChange: (i: number) => void }) {
  return (
    <Row gap={6}>
      {options.map((o, i) => <Chip key={o} label={o} size={12} px={11} py={5} active={i === value} onPress={() => onChange(i)} />)}
    </Row>
  );
}
