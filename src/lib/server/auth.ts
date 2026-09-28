import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import type { Cookies } from '@sveltejs/kit';
import { db, type User } from './db';

const COOKIE = 'eaut_session';
const TTL_MS = 1000 * 60 * 60 * 24 * 7;

function tokenHash(token: string): string {
	return createHash('sha256').update(token).digest('hex');
}

export function verifyPassword(password: string, stored: string): boolean {
	const [salt, hash] = stored.split(':');
	if (!salt || !hash) return false;
	const actual = scryptSync(password, salt, 64);
	const expected = Buffer.from(hash, 'hex');
	return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function signIn(email: string, password: string, cookies: Cookies): User | null {
	const record = db.prepare('SELECT * FROM users WHERE lower(email) = lower(?)').get(email.trim()) as
		| (User & { password_hash: string })
		| undefined;
	if (!record || record.status !== 'ACTIVE' || !verifyPassword(password, record.password_hash)) return null;
	const token = randomBytes(32).toString('hex');
	db.prepare('INSERT INTO sessions(token_hash, user_id, expires_at) VALUES (?, ?, ?)')
		.run(tokenHash(token), record.id, Date.now() + TTL_MS);
	cookies.set(COOKIE, token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		maxAge: TTL_MS / 1000
	});
	const { password_hash: _passwordHash, ...user } = record;
	return user;
}

export function currentUser(cookies: Cookies): User | null {
	const token = cookies.get(COOKIE);
	if (!token) return null;
	const record = db.prepare(`
		SELECT u.id, u.code, u.full_name, u.email, u.role, u.status
		FROM sessions s JOIN users u ON u.id = s.user_id
		WHERE s.token_hash = ? AND s.expires_at > ?
	`).get(tokenHash(token), Date.now()) as User | undefined;
	return record?.status === 'ACTIVE' ? record : null;
}

export function signOut(cookies: Cookies): void {
	const token = cookies.get(COOKIE);
	if (token) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash(token));
	cookies.delete(COOKIE, { path: '/' });
}
