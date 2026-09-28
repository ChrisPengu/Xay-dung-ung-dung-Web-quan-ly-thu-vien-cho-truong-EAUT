import { error, redirect } from '@sveltejs/kit';
import type { User } from './db';

export function requireUser(user: User | null): User {
	if (!user) redirect(303, '/login');
	return user;
}

export function requireStaff(user: User | null): User {
	const authenticated = requireUser(user);
	if (authenticated.role === 'READER') error(403, 'Bạn không có quyền thực hiện thao tác này.');
	return authenticated;
}

export function value(data: FormData, key: string): string {
	return String(data.get(key) ?? '').trim();
}
