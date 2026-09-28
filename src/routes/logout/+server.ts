import { redirect } from '@sveltejs/kit';
import { signOut } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = ({ cookies }) => {
	signOut(cookies);
	redirect(303, '/login');
};
