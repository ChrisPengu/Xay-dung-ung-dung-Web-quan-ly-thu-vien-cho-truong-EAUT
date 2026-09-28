import type { Handle } from '@sveltejs/kit';
import { currentUser } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.user = currentUser(event.cookies);
	return resolve(event);
};
