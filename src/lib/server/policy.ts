export const MAX_ACTIVE_LOANS = 5;
export const LOAN_DAYS = 14;
export const MAX_RENEWALS = 1;

export function addDays(isoDate: string, days: number): string {
	const date = new Date(isoDate);
	date.setUTCDate(date.getUTCDate() + days);
	return date.toISOString();
}

export function isOverdue(dueAt: string, now = new Date()): boolean {
	return new Date(dueAt).getTime() < now.getTime();
}

export function mayBorrow(activeCount: number, hasOverdue: boolean, status: string): string | null {
	if (status !== 'ACTIVE') return 'Tài khoản độc giả đang bị khóa.';
	if (hasOverdue) return 'Độc giả còn sách quá hạn, vui lòng xử lý trước khi mượn tiếp.';
	if (activeCount >= MAX_ACTIVE_LOANS) return `Mỗi độc giả chỉ được mượn tối đa ${MAX_ACTIVE_LOANS} cuốn cùng lúc.`;
	return null;
}

export function mayRenew(dueAt: string, renewals: number, returnedAt: string | null, now = new Date()): string | null {
	if (returnedAt) return 'Sách đã trả nên không thể gia hạn.';
	if (isOverdue(dueAt, now)) return 'Sách đã quá hạn, vui lòng liên hệ thủ thư.';
	if (renewals >= MAX_RENEWALS) return 'Phiếu mượn này đã dùng hết lượt gia hạn.';
	return null;
}
