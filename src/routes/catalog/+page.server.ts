import { library } from '$lib/server/library';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url, locals }) => {
	const search = url.searchParams.get('q') ?? '';
	const category = url.searchParams.get('category') ?? '';
	return {
		search, category,
		books: library.listBooks(search, category),
		categories: library.categories(),
		isStaff: locals.user?.role === 'ADMIN' || locals.user?.role === 'LIBRARIAN'
	};
};
