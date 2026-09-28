import type { DatabaseSync } from 'node:sqlite';
import { db, hashPassword, type Book, type Copy, type Loan, type User } from './db';
import { addDays, isOverdue, LOAN_DAYS, mayBorrow, mayRenew } from './policy';
import { isEautEmail } from './validation';

export type BookInput = {
	code: string;
	isbn: string;
	title: string;
	author: string;
	category: string;
	publisher: string;
	publishedYear: number | null;
	description: string;
	coverColor: string;
};

export function createLibrary(database: DatabaseSync) {
	const booksSql = `SELECT b.*,
		(SELECT count(*) FROM copies c WHERE c.book_id=b.id) total_copies,
		(SELECT count(*) FROM copies c WHERE c.book_id=b.id AND c.status='AVAILABLE' AND c.condition='GOOD') available_copies
		FROM books b`;
	const loansSql = `SELECT l.*, b.title, c.accession_no, u.full_name reader_name, u.code reader_code
		FROM loans l JOIN copies c ON c.id=l.copy_id JOIN books b ON b.id=c.book_id
		JOIN users u ON u.id=l.reader_id`;
	const tx = <T>(work: () => T): T => {
		database.exec('BEGIN IMMEDIATE');
		try {
			const result = work();
			database.exec('COMMIT');
			return result;
		} catch (error) {
			database.exec('ROLLBACK');
			throw error;
		}
	};
	return {
		listBooks(search = '', category = ''): Book[] {
			const q = `%${search.trim()}%`;
			return database.prepare(`${booksSql} WHERE b.archived=0 AND (?='' OR b.category=?)
				AND (b.title LIKE ? OR b.author LIKE ? OR b.code LIKE ? OR coalesce(b.isbn,'') LIKE ?)
				ORDER BY b.id DESC`).all(category, category, q, q, q, q) as unknown as Book[];
		},
		categories(): string[] {
			return (database.prepare('SELECT DISTINCT category FROM books WHERE archived=0 ORDER BY category')
				.all() as { category: string }[]).map((r) => r.category);
		},
		getBook(id: number): Book | undefined {
			return database.prepare(`${booksSql} WHERE b.id=? AND b.archived=0`).get(id) as Book | undefined;
		},
		listCopies(bookId?: number): Copy[] {
			const sql = `SELECT c.*, b.title FROM copies c JOIN books b ON b.id=c.book_id
				WHERE b.archived=0 ${bookId ? 'AND c.book_id=?' : ''} ORDER BY b.title,c.accession_no`;
			return (bookId ? database.prepare(sql).all(bookId) : database.prepare(sql).all()) as Copy[];
		},
		listReaders(search = '', status = ''): (User & { active_loans: number })[] {
			const q = `%${search.trim()}%`;
			return database.prepare(`SELECT u.id,u.code,u.full_name,u.email,u.role,u.status,
				(SELECT count(*) FROM loans l WHERE l.reader_id=u.id AND l.returned_at IS NULL) active_loans
				FROM users u WHERE u.role='READER'
				AND (u.code LIKE ? OR u.full_name LIKE ? OR u.email LIKE ?)
				AND (?='' OR u.status=?) ORDER BY u.id DESC`).all(q, q, q, status, status) as unknown as
				(User & { active_loans: number })[];
		},
		getReader(id: number): User | undefined {
			return database.prepare(`SELECT id,code,full_name,email,role,status FROM users WHERE id=? AND role='READER'`)
				.get(id) as User | undefined;
		},
		createReader(code: string, name: string, email: string, password: string): number {
			if (!/^[A-Za-z0-9-]{4,24}$/.test(code)) throw new Error('Mã độc giả cần 4-24 ký tự chữ, số hoặc dấu gạch ngang.');
			if (name.trim().length < 2 || name.trim().length > 100) throw new Error('Họ tên cần từ 2 đến 100 ký tự.');
			if (!isEautEmail(email)) throw new Error('Email độc giả cần dùng đuôi @eaut.edu.vn.');
			if (password.length < 8) throw new Error('Mật khẩu cần ít nhất 8 ký tự.');
			try {
				return Number(database.prepare(`INSERT INTO users(code,full_name,email,password_hash,role) VALUES (?,?,?,?,'READER')`)
					.run(code.trim().toUpperCase(), name.trim(), email.trim().toLowerCase(), hashPassword(password)).lastInsertRowid);
			} catch {
				throw new Error('Mã độc giả hoặc email đã được sử dụng.');
			}
		},
		setReaderStatus(id: number, status: 'ACTIVE' | 'LOCKED'): void {
			if (!Number.isInteger(id) || id < 1) throw new Error('Độc giả không hợp lệ.');
			if (status !== 'ACTIVE' && status !== 'LOCKED') throw new Error('Trạng thái tài khoản không hợp lệ.');
			tx(() => {
				const result = database.prepare(`UPDATE users SET status=? WHERE id=? AND role='READER'`).run(status, id);
				if (!result.changes) throw new Error('Không tìm thấy độc giả.');
				if (status === 'LOCKED') database.prepare('DELETE FROM sessions WHERE user_id=?').run(id);
			});
		},
		createBook(input: BookInput): number {
			validateBook(input);
			try {
				return Number(database.prepare(`INSERT INTO books(code,isbn,title,author,category,publisher,published_year,description,cover_color)
					VALUES (?,?,?,?,?,?,?,?,?)`).run(input.code,input.isbn || null,input.title,input.author,
					input.category,input.publisher,input.publishedYear,input.description,input.coverColor).lastInsertRowid);
			} catch {
				throw new Error('Mã sách hoặc ISBN đã tồn tại.');
			}
		},
		updateBook(id: number, input: BookInput): void {
			validateBook(input);
			try {
				const result = database.prepare(`UPDATE books SET code=?,isbn=?,title=?,author=?,category=?,
					publisher=?,published_year=?,description=?,cover_color=? WHERE id=? AND archived=0`)
					.run(input.code,input.isbn || null,input.title,input.author,input.category,
						input.publisher,input.publishedYear,input.description,input.coverColor,id);
				if (!result.changes) throw new Error('Không tìm thấy đầu sách.');
			} catch (error) {
				if (error instanceof Error && error.message === 'Không tìm thấy đầu sách.') throw error;
				throw new Error('Mã sách hoặc ISBN đã tồn tại.');
			}
		},
		archiveBook(id: number): void {
			const active = database.prepare(`SELECT count(*) count FROM loans l JOIN copies c ON c.id=l.copy_id
				WHERE c.book_id=? AND l.returned_at IS NULL`).get(id) as { count: number };
			if (active.count) throw new Error('Đầu sách còn bản đang được mượn, chưa thể lưu trữ.');
			database.prepare('UPDATE books SET archived=1 WHERE id=?').run(id);
		},
		addCopy(bookId: number, accessionNo: string, shelf: string): void {
			if (!this.getBook(bookId)) throw new Error('Không tìm thấy đầu sách.');
			if (!/^[A-Za-z0-9-]{4,32}$/.test(accessionNo)) throw new Error('Mã bản sách cần 4-32 ký tự chữ, số hoặc dấu gạch ngang.');
			if (!shelf.trim() || shelf.length > 40) throw new Error('Vui lòng nhập vị trí kệ (tối đa 40 ký tự).');
			try {
				database.prepare('INSERT INTO copies(book_id,accession_no,shelf) VALUES (?,?,?)')
					.run(bookId,accessionNo.trim().toUpperCase(),shelf.trim());
			} catch { throw new Error('Mã bản sách đã tồn tại.'); }
		},
		updateCopy(copyId: number, shelf: string, condition: Copy['condition']): void {
			if (!Number.isInteger(copyId) || copyId < 1) throw new Error('Bản sách không hợp lệ.');
			if (!shelf.trim() || shelf.trim().length > 40) throw new Error('Vui lòng nhập vị trí kệ (tối đa 40 ký tự).');
			if (!['GOOD', 'DAMAGED', 'LOST'].includes(condition)) throw new Error('Tình trạng bản sách không hợp lệ.');
			tx(() => {
				const copy = database.prepare(`SELECT c.* FROM copies c JOIN books b ON b.id=c.book_id
					WHERE c.id=? AND b.archived=0`).get(copyId) as Copy | undefined;
				if (!copy) throw new Error('Không tìm thấy bản sách.');
				const active = database.prepare('SELECT 1 FROM loans WHERE copy_id=? AND returned_at IS NULL').get(copyId);
				if (copy.status === 'BORROWED' || active) throw new Error('Bản sách đang được mượn, hãy nhận trả trước khi chỉnh sửa.');
				database.prepare('UPDATE copies SET shelf=?,condition=?,status=? WHERE id=?')
					.run(shelf.trim(), condition, condition === 'GOOD' ? 'AVAILABLE' : 'UNAVAILABLE', copyId);
			});
		},
		listLoans(includeReturned = true, readerId?: number): Loan[] {
			const conditions: string[] = [];
			const params: number[] = [];
			if (!includeReturned) conditions.push('l.returned_at IS NULL');
			if (readerId) { conditions.push('l.reader_id=?'); params.push(readerId); }
			const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
			return database.prepare(`${loansSql} ${where} ORDER BY l.id DESC`).all(...params) as unknown as Loan[];
		},
		issueLoan(copyId: number, readerId: number, now = new Date()): number {
			return tx(() => {
				const copy = database.prepare(`SELECT c.* FROM copies c JOIN books b ON b.id=c.book_id
					WHERE c.id=? AND b.archived=0`).get(copyId) as Copy | undefined;
				if (!copy || copy.status !== 'AVAILABLE' || copy.condition !== 'GOOD')
					throw new Error('Bản sách không sẵn sàng để cho mượn.');
				const reader = this.getReader(readerId);
				if (!reader) throw new Error('Không tìm thấy độc giả.');
				const active = database.prepare(`SELECT count(*) count,
					sum(CASE WHEN due_at < ? THEN 1 ELSE 0 END) overdue
					FROM loans WHERE reader_id=? AND returned_at IS NULL`)
					.get(now.toISOString(),readerId) as { count: number; overdue: number | null };
				const reason = mayBorrow(active.count, Boolean(active.overdue), reader.status);
				if (reason) throw new Error(reason);
				const result = database.prepare('INSERT INTO loans(copy_id,reader_id,borrowed_at,due_at) VALUES (?,?,?,?)')
					.run(copyId,readerId,now.toISOString(),addDays(now.toISOString(),LOAN_DAYS));
				database.prepare(`UPDATE copies SET status='BORROWED' WHERE id=?`).run(copyId);
				return Number(result.lastInsertRowid);
			});
		},
		returnLoan(id: number, now = new Date()): void {
			tx(() => {
				const loan = database.prepare('SELECT copy_id,returned_at FROM loans WHERE id=?')
					.get(id) as { copy_id: number; returned_at: string | null } | undefined;
				if (!loan) throw new Error('Không tìm thấy phiếu mượn.');
				if (loan.returned_at) throw new Error('Phiếu này đã được trả trước đó.');
				database.prepare('UPDATE loans SET returned_at=? WHERE id=?').run(now.toISOString(),id);
				database.prepare(`UPDATE copies SET status='AVAILABLE' WHERE id=?`).run(loan.copy_id);
			});
		},
		renewLoan(id: number, now = new Date()): void {
			tx(() => {
				const loan = database.prepare(`SELECT l.due_at,l.renewals,l.returned_at,u.status reader_status
					FROM loans l JOIN users u ON u.id=l.reader_id WHERE l.id=?`)
					.get(id) as { due_at: string; renewals: number; returned_at: string | null; reader_status: string } | undefined;
				if (!loan) throw new Error('Không tìm thấy phiếu mượn.');
				if (loan.reader_status !== 'ACTIVE') throw new Error('Tài khoản độc giả đang bị khóa.');
				const reason = mayRenew(loan.due_at,loan.renewals,loan.returned_at,now);
				if (reason) throw new Error(reason);
				database.prepare('UPDATE loans SET due_at=?,renewals=renewals+1 WHERE id=?')
					.run(addDays(loan.due_at,LOAN_DAYS),id);
			});
		},
		stats(now = new Date()) {
			const count = (sql: string, ...params: (string | number)[]) =>
				(database.prepare(sql).get(...params) as { count: number }).count;
			return {
				books: count('SELECT count(*) count FROM books WHERE archived=0'),
				copies: count(`SELECT count(*) count FROM copies c JOIN books b ON b.id=c.book_id
					WHERE b.archived=0 AND c.status='AVAILABLE' AND c.condition='GOOD'`),
				activeLoans: count('SELECT count(*) count FROM loans WHERE returned_at IS NULL'),
				overdue: count('SELECT count(*) count FROM loans WHERE returned_at IS NULL AND due_at<?',now.toISOString()),
				readers: count(`SELECT count(*) count FROM users WHERE role='READER' AND status='ACTIVE'`)
			};
		}
	};
}

function validateBook(input: BookInput): void {
	if (!/^[A-Za-z0-9-]{3,32}$/.test(input.code)) throw new Error('Mã sách cần 3-32 ký tự chữ, số hoặc dấu gạch ngang.');
	if (input.isbn && !/^[0-9-]{10,17}$/.test(input.isbn)) throw new Error('ISBN chưa đúng định dạng.');
	if (input.title.length < 2 || input.title.length > 200) throw new Error('Tên sách cần từ 2 đến 200 ký tự.');
	if (input.author.length < 2 || input.author.length > 120) throw new Error('Tên tác giả cần từ 2 đến 120 ký tự.');
	if (!input.category || input.category.length > 80) throw new Error('Vui lòng nhập thể loại (tối đa 80 ký tự).');
	if (input.publisher.length > 120) throw new Error('Tên nhà xuất bản tối đa 120 ký tự.');
	if (input.publishedYear !== null && (!Number.isInteger(input.publishedYear) || input.publishedYear < 1450 || input.publishedYear > new Date().getFullYear()+1))
		throw new Error('Năm xuất bản chưa hợp lệ.');
	if (input.description.length > 2000) throw new Error('Mô tả tối đa 2000 ký tự.');
	if (!/^#[0-9a-fA-F]{6}$/.test(input.coverColor)) throw new Error('Màu bìa chưa hợp lệ.');
}

export const library = createLibrary(db);
export { isOverdue };
