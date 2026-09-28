import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { randomBytes, scryptSync } from 'node:crypto';

export type Role = 'ADMIN' | 'LIBRARIAN' | 'READER';
export type User = {
	id: number;
	code: string;
	full_name: string;
	email: string;
	role: Role;
	status: 'ACTIVE' | 'LOCKED';
};

export type Book = {
	id: number;
	code: string;
	isbn: string | null;
	title: string;
	author: string;
	category: string;
	publisher: string;
	published_year: number | null;
	description: string;
	cover_color: string;
	archived: number;
	total_copies: number;
	available_copies: number;
};

export type Copy = {
	id: number;
	book_id: number;
	accession_no: string;
	shelf: string;
	condition: 'GOOD' | 'DAMAGED' | 'LOST';
	status: 'AVAILABLE' | 'BORROWED' | 'UNAVAILABLE';
	title?: string;
};

export type Loan = {
	id: number;
	copy_id: number;
	reader_id: number;
	borrowed_at: string;
	due_at: string;
	returned_at: string | null;
	renewals: number;
	title: string;
	accession_no: string;
	reader_name: string;
	reader_code: string;
};

export function hashPassword(password: string): string {
	const salt = randomBytes(16).toString('hex');
	return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
}

export function createDatabase(filename: string): DatabaseSync {
	if (filename !== ':memory:') mkdirSync(dirname(filename), { recursive: true });
	const db = new DatabaseSync(filename);
	db.exec('PRAGMA foreign_keys = ON');
	if (filename !== ':memory:') db.exec('PRAGMA journal_mode = WAL');
	db.exec(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			code TEXT NOT NULL UNIQUE,
			full_name TEXT NOT NULL,
			email TEXT NOT NULL UNIQUE,
			password_hash TEXT NOT NULL,
			role TEXT NOT NULL CHECK (role IN ('ADMIN','LIBRARIAN','READER')),
			status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','LOCKED')),
			created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
		);
		CREATE TABLE IF NOT EXISTS sessions (
			token_hash TEXT PRIMARY KEY,
			user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			expires_at INTEGER NOT NULL
		);
		CREATE TABLE IF NOT EXISTS books (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			code TEXT NOT NULL UNIQUE,
			isbn TEXT UNIQUE,
			title TEXT NOT NULL,
			author TEXT NOT NULL,
			category TEXT NOT NULL,
			publisher TEXT NOT NULL DEFAULT '',
			published_year INTEGER,
			description TEXT NOT NULL DEFAULT '',
			cover_color TEXT NOT NULL DEFAULT '#c9e4df',
			archived INTEGER NOT NULL DEFAULT 0,
			created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
		);
		CREATE TABLE IF NOT EXISTS copies (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			book_id INTEGER NOT NULL REFERENCES books(id),
			accession_no TEXT NOT NULL UNIQUE,
			shelf TEXT NOT NULL,
			condition TEXT NOT NULL DEFAULT 'GOOD' CHECK (condition IN ('GOOD','DAMAGED','LOST')),
			status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE','BORROWED','UNAVAILABLE'))
		);
		CREATE TABLE IF NOT EXISTS loans (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			copy_id INTEGER NOT NULL REFERENCES copies(id),
			reader_id INTEGER NOT NULL REFERENCES users(id),
			borrowed_at TEXT NOT NULL,
			due_at TEXT NOT NULL,
			returned_at TEXT,
			renewals INTEGER NOT NULL DEFAULT 0
		);
		CREATE UNIQUE INDEX IF NOT EXISTS one_open_loan_per_copy
			ON loans(copy_id) WHERE returned_at IS NULL;
		CREATE INDEX IF NOT EXISTS loans_reader ON loans(reader_id, returned_at);
	`);
	return db;
}

const filename = process.env.DATABASE_PATH === ':memory:'
	? ':memory:'
	: resolve(process.env.DATABASE_PATH || 'data/eaut-library.sqlite');
export const db = createDatabase(filename);

export function migrateDemoEmails(database: DatabaseSync): void {
	const knownAccounts = [
		['admin@demo.eaut.local', 'admin@eaut.edu.vn'],
		['thuthu@demo.eaut.local', 'thuthu@eaut.edu.vn'],
		['minhanh@demo.eaut.local', 'minhanh@eaut.edu.vn'],
		['quocbao@demo.eaut.local', 'quocbao@eaut.edu.vn']
	];
	const update = database.prepare('UPDATE users SET email=? WHERE email=? AND NOT EXISTS (SELECT 1 FROM users WHERE email=?)');
	for (const [oldEmail, newEmail] of knownAccounts) update.run(newEmail, oldEmail, newEmail);
}

migrateDemoEmails(db);

export function migrateNamedDemoAccounts(database: DatabaseSync): void {
	const changes = [
		['AD001', 'ADMIN', 'Quản trị hệ thống', 'admin@eaut.edu.vn', 'Vũ Mười', 'vumuoi@eaut.edu.vn'],
		['TV001', 'LIBRARIAN', 'Thủ thư Hà Anh', 'thuthu@eaut.edu.vn', 'Bá Hiếu', 'bahieu@eaut.edu.vn'],
		['SV2026001', 'READER', 'Nguyễn Minh Anh', 'minhanh@eaut.edu.vn', 'Qang Minh', 'qangminh@eaut.edu.vn']
	] as const;
	const update = database.prepare(`UPDATE users SET full_name=?, email=?
		WHERE code=? AND role=? AND full_name=? AND email=?
		AND NOT EXISTS (SELECT 1 FROM users other WHERE other.email=?)`);
	for (const [code, role, oldName, oldEmail, newName, newEmail] of changes) {
		update.run(newName, newEmail, code, role, oldName, oldEmail, newEmail);
	}
}

migrateNamedDemoAccounts(db);

export function seedDemo(): void {
	const existing = db.prepare('SELECT count(*) AS count FROM users').get() as { count: number };
	if (existing.count) return;
	const password = hashPassword('Demo123!');
	const user = db.prepare(
		'INSERT INTO users(code, full_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)'
	);
	user.run('AD001', 'Vũ Mười', 'vumuoi@eaut.edu.vn', password, 'ADMIN');
	user.run('TV001', 'Bá Hiếu', 'bahieu@eaut.edu.vn', password, 'LIBRARIAN');
	user.run('SV2026001', 'Qang Minh', 'qangminh@eaut.edu.vn', password, 'READER');
	user.run('SV2026002', 'Trần Quốc Bảo', 'quocbao@eaut.edu.vn', password, 'READER');

	const bookRows = [
		['E-LIB-001', '9786043966589', 'Lập trình Python căn bản', 'Nguyễn Văn Hiệp', 'Công nghệ thông tin', 'NXB Khoa học và Kỹ thuật', 2023, 'Từ nền tảng ngôn ngữ đến bài tập thực hành.', '#c9e4df'],
		['E-LIB-002', '9780132350884', 'Clean Code', 'Robert C. Martin', 'Công nghệ thông tin', 'Prentice Hall', 2008, 'Kỹ năng viết mã dễ đọc và dễ bảo trì.', '#e8d9c4'],
		['E-LIB-003', '9780134494166', 'Clean Architecture', 'Robert C. Martin', 'Công nghệ thông tin', 'Pearson', 2017, 'Những nguyên lý thiết kế phần mềm bền vững.', '#d7d9ec'],
		['E-LIB-004', '9786049896262', 'Cơ sở dữ liệu', 'Nguyễn Tuệ', 'Công nghệ thông tin', 'NXB Đại học Quốc gia Hà Nội', 2022, 'Mô hình dữ liệu, SQL và ứng dụng.', '#e9d6d0'],
		['E-LIB-005', '9786043157543', 'Kinh tế học vi mô', 'Đặng Văn Thắng', 'Kinh tế', 'NXB Giáo dục Việt Nam', 2021, 'Các khái niệm nền tảng về thị trường và doanh nghiệp.', '#eee3c9'],
		['E-LIB-006', '9786049764851', 'Quản trị dự án', 'Nguyễn Bạch Nguyệt', 'Quản trị', 'NXB Đại học Kinh tế Quốc dân', 2020, 'Lập kế hoạch, tổ chức và đánh giá dự án.', '#d4e5d6'],
		['E-LIB-007', '9780135957059', 'The Pragmatic Programmer', 'David Thomas, Andrew Hunt', 'Công nghệ thông tin', 'Addison-Wesley', 2019, 'Cẩm nang thực hành phát triển phần mềm.', '#ecd9d5'],
		['E-LIB-008', '9786040269867', 'Giải tích 1', 'Nguyễn Đình Trí', 'Khoa học cơ bản', 'NXB Giáo dục Việt Nam', 2021, 'Hàm số, giới hạn, đạo hàm và tích phân.', '#d7e4ed']
	] as const;
	const insertBook = db.prepare(
		'INSERT INTO books(code, isbn, title, author, category, publisher, published_year, description, cover_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
	);
	const insertCopy = db.prepare(
		'INSERT INTO copies(book_id, accession_no, shelf) VALUES (?, ?, ?)'
	);
	for (const [index, row] of bookRows.entries()) {
		const id = Number(insertBook.run(...row).lastInsertRowid);
		for (let copy = 1; copy <= (index % 3) + 2; copy++) {
			insertCopy.run(id, `EAUT-${String(index + 1).padStart(3, '0')}-${String(copy).padStart(2, '0')}`, `A${Math.floor(index / 3) + 1}-${(index % 3) + 1}`);
		}
	}
}

if (process.env.DEMO_SEED !== 'false') seedDemo();
