import { library } from '$lib/server/library';
import { requireUser } from '$lib/server/guards';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	const user = requireUser(locals.user);
	const loans = library.listLoans(false, user.role === 'READER' ? user.id : undefined);
	return {
		stats: library.stats(),
		loans: loans.slice(0, 5),
		readerOverdue: loans.filter((loan) => new Date(loan.due_at) < new Date()).length,
		books: library.listBooks().slice(0, 4),
		isStaff: user.role !== 'READER'
	};
};
