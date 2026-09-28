import { describe, expect, it } from 'vitest';
import { addDays, isOverdue, mayBorrow, mayRenew, MAX_ACTIVE_LOANS } from '../../src/lib/server/policy';

describe('UT - chính sách mượn sách', () => {
	it('tính hạn trả sau 14 ngày', () => {
		expect(addDays('2026-09-01T00:00:00.000Z', 14)).toBe('2026-09-15T00:00:00.000Z');
	});
	it('phân biệt đúng ranh giới quá hạn', () => {
		expect(isOverdue('2026-09-15T00:00:00.000Z', new Date('2026-09-15T00:00:00.000Z'))).toBe(false);
		expect(isOverdue('2026-09-15T00:00:00.000Z', new Date('2026-09-15T00:00:01.000Z'))).toBe(true);
	});
	it('chặn độc giả bị khóa, quá hạn và đạt giới hạn mượn', () => {
		expect(mayBorrow(0, false, 'LOCKED')).toBeTruthy();
		expect(mayBorrow(1, true, 'ACTIVE')).toBeTruthy();
		expect(mayBorrow(MAX_ACTIVE_LOANS, false, 'ACTIVE')).toBeTruthy();
		expect(mayBorrow(MAX_ACTIVE_LOANS - 1, false, 'ACTIVE')).toBeNull();
	});
	it('chỉ cho gia hạn một lần và trước hạn trả', () => {
		const now = new Date('2026-09-10T00:00:00.000Z');
		expect(mayRenew('2026-09-15T00:00:00.000Z', 0, null, now)).toBeNull();
		expect(mayRenew('2026-09-15T00:00:00.000Z', 1, null, now)).toBeTruthy();
		expect(mayRenew('2026-09-09T00:00:00.000Z', 0, null, now)).toBeTruthy();
		expect(mayRenew('2026-09-15T00:00:00.000Z', 0, now.toISOString(), now)).toBeTruthy();
	});
});
