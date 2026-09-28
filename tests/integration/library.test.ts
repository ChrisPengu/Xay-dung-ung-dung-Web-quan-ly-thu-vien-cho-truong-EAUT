import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createDatabase, migrateDemoEmails, migrateNamedDemoAccounts } from '../../src/lib/server/db';
import { createLibrary } from '../../src/lib/server/library';
import type { DatabaseSync } from 'node:sqlite';

let db: DatabaseSync;
let library: ReturnType<typeof createLibrary>;
beforeEach(() => {
	db = createDatabase(':memory:');
	library = createLibrary(db);
	db.prepare(`INSERT INTO users(code,full_name,email,password_hash,role) VALUES ('SV0001','Bạn đọc','reader@test.local','hash','READER')`).run();
	db.prepare(`INSERT INTO books(code,title,author,category) VALUES ('TEST-BOOK','Kiểm thử','Nhóm EAUT','CNTT')`).run();
	db.prepare(`INSERT INTO copies(book_id,accession_no,shelf) VALUES (1,'COPY-01','A1'),(1,'COPY-02','A1')`).run();
});
afterEach(() => db.close());

describe('IT - thư viện và dữ liệu', () => {
	it('lập phiếu và trả sách cập nhật trạng thái bản sách', () => {
		const id = library.issueLoan(1, 1, new Date('2026-09-01T00:00:00.000Z'));
		expect(library.listCopies(1)[0].status).toBe('BORROWED');
		library.returnLoan(id, new Date('2026-09-02T00:00:00.000Z'));
		expect(library.listCopies(1)[0].status).toBe('AVAILABLE');
		expect(() => library.returnLoan(id)).toThrow();
	});
	it('không cho hai phiếu mở trên cùng một bản sách', () => {
		library.issueLoan(1, 1);
		expect(() => library.issueLoan(1, 1)).toThrow();
		expect(library.listLoans(false)).toHaveLength(1);
	});
	it('độc giả quá hạn không được mượn bản khác', () => {
		const id = library.issueLoan(1, 1, new Date('2026-09-01T00:00:00.000Z'));
		expect(id).toBe(1);
		expect(() => library.issueLoan(2, 1, new Date('2026-10-01T00:00:00.000Z'))).toThrow();
		expect(library.listLoans(false)).toHaveLength(1);
	});
	it('độc giả bị khóa không được gia hạn phiếu còn hạn', () => {
		const id = library.issueLoan(1, 1, new Date('2026-09-01T00:00:00.000Z'));
		db.prepare(`UPDATE users SET status='LOCKED' WHERE id=1`).run();
		expect(() => library.renewLoan(id, new Date('2026-09-02T00:00:00.000Z'))).toThrow();
	});
	it('không cho mượn bản sách thuộc đầu sách đã lưu trữ qua request trực tiếp', () => {
		library.archiveBook(1);
		expect(() => library.issueLoan(1, 1)).toThrow();
		expect(library.listLoans(false)).toHaveLength(0);
	});
	it('sửa và lưu trữ đầu sách nhưng không xóa lịch sử mượn', () => {
		const input = { code: 'NEW-001', isbn: '', title: 'Sách mới', author: 'Nhóm EAUT',
			category: 'CNTT', publisher: '', publishedYear: 2026, description: '', coverColor: '#c9e4df' };
		const id = library.createBook(input);
		library.updateBook(id, { ...input, title: 'Sách đã sửa' });
		expect(library.getBook(id)?.title).toBe('Sách đã sửa');
		library.archiveBook(id);
		expect(library.getBook(id)).toBeUndefined();
	});
	it('chuyển tình trạng bản sách và chặn mượn bản hỏng hoặc mất', () => {
		library.updateCopy(1, 'B2', 'DAMAGED');
		expect(library.listCopies(1)[0]).toMatchObject({ shelf: 'B2', condition: 'DAMAGED', status: 'UNAVAILABLE' });
		expect(() => library.issueLoan(1, 1)).toThrow();
		library.updateCopy(1, 'B2', 'GOOD');
		expect(library.listCopies(1)[0].status).toBe('AVAILABLE');
		library.updateCopy(1, 'B3', 'LOST');
		expect(library.listCopies(1)[0].status).toBe('UNAVAILABLE');
	});
	it('không cho sửa tình trạng bản đang mượn nhưng vẫn nhận trả được', () => {
		const loanId = library.issueLoan(1, 1);
		expect(() => library.updateCopy(1, 'B2', 'DAMAGED')).toThrow();
		expect(library.listCopies(1)[0].status).toBe('BORROWED');
		library.returnLoan(loanId);
		library.updateCopy(1, 'B2', 'DAMAGED');
		expect(library.listCopies(1)[0].status).toBe('UNAVAILABLE');
	});
	it('khóa độc giả chặn mượn và gia hạn nhưng giữ phiếu để nhận trả', () => {
		const loanId = library.issueLoan(1, 1, new Date('2026-09-01T00:00:00.000Z'));
		library.setReaderStatus(1, 'LOCKED');
		expect(library.listReaders('', 'LOCKED')).toHaveLength(1);
		expect(() => library.issueLoan(2, 1, new Date('2026-09-02T00:00:00.000Z'))).toThrow();
		expect(() => library.renewLoan(loanId, new Date('2026-09-02T00:00:00.000Z'))).toThrow();
		library.returnLoan(loanId);
		library.setReaderStatus(1, 'ACTIVE');
		expect(library.listReaders('SV0001')).toHaveLength(1);
	});
	it('tạo độc giả mới chỉ với email EAUT', () => {
		expect(() => library.createReader('SV0002', 'Bạn đọc mới', 'ngoai@gmail.com', 'Test1234!')).toThrow();
		expect(library.createReader('SV0002', 'Bạn đọc mới', 'sv0002@eaut.edu.vn', 'Test1234!')).toBeGreaterThan(0);
	});
	it('chỉ chuyển email tài khoản demo cũ, giữ email khác', () => {
		db.prepare(`INSERT INTO users(code,full_name,email,password_hash,role) VALUES
			('TVDEMO','Thủ thư mẫu','thuthu@demo.eaut.local','hash','LIBRARIAN'),
			('SVKHAC','Độc giả cũ','old@example.org','hash','READER')`).run();
		migrateDemoEmails(db);
		const emails = db.prepare('SELECT email FROM users ORDER BY code').all() as { email: string }[];
		expect(emails.map((row) => row.email)).toContain('thuthu@eaut.edu.vn');
		expect(emails.map((row) => row.email)).toContain('old@example.org');
		expect(emails.map((row) => row.email)).not.toContain('thuthu@demo.eaut.local');
	});
	it('thống kê kho không tính bản thuộc đầu sách đã lưu trữ', () => {
		expect(library.stats().copies).toBe(2);
		library.archiveBook(1);
		expect(library.stats().copies).toBe(0);
	});
	it('đổi đúng ba tài khoản demo cũ và không ghi đè tài khoản khác', () => {
		db.prepare(`INSERT INTO users(code,full_name,email,password_hash,role) VALUES
			('AD001','Quản trị hệ thống','admin@eaut.edu.vn','hash-admin','ADMIN'),
			('TV001','Thủ thư Hà Anh','thuthu@eaut.edu.vn','hash-staff','LIBRARIAN'),
			('SV2026001','Nguyễn Minh Anh','minhanh@eaut.edu.vn','hash-reader','READER'),
			('TVOTHER','Tên tự đặt','other@eaut.edu.vn','hash-other','LIBRARIAN')`).run();
		migrateNamedDemoAccounts(db);
		migrateNamedDemoAccounts(db);
		const users = db.prepare('SELECT code,full_name,email,password_hash,role FROM users ORDER BY code').all() as
			{ code: string; full_name: string; email: string; password_hash: string; role: string }[];
		expect(users.find((user) => user.code === 'AD001')).toMatchObject({
			full_name: 'Vũ Mười', email: 'vumuoi@eaut.edu.vn', password_hash: 'hash-admin', role: 'ADMIN'
		});
		expect(users.find((user) => user.code === 'TV001')).toMatchObject({
			full_name: 'Bá Hiếu', email: 'bahieu@eaut.edu.vn'
		});
		expect(users.find((user) => user.code === 'SV2026001')).toMatchObject({
			full_name: 'Qang Minh', email: 'qangminh@eaut.edu.vn'
		});
		expect(users.find((user) => user.code === 'TVOTHER')?.full_name).toBe('Tên tự đặt');
	});
});
