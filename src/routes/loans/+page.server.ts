import { fail, redirect } from '@sveltejs/kit';
import { library } from '$lib/server/library';
import { requireStaff, requireUser, value } from '$lib/server/guards';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals, url }) => {
	const user = requireUser(locals.user);
	return {
		loans: library.listLoans(true, user.role === 'READER' ? user.id : undefined),
		isStaff: user.role !== 'READER',
		updated: url.searchParams.get('updated') === '1'
	};
};

export const actions: Actions = {
	return: async ({ locals, request }) => {
		requireStaff(locals.user);
		const id = Number(value(await request.formData(), 'id'));
		try { library.returnLoan(id); }
		catch (cause) { return fail(400, { message: cause instanceof Error ? cause.message : 'Không thể trả sách.' }); }
		redirect(303, '/loans?updated=1');
	},
	renew: async ({ locals, request }) => {
		requireStaff(locals.user);
		const id = Number(value(await request.formData(), 'id'));
		try { library.renewLoan(id); }
		catch (cause) { return fail(400, { message: cause instanceof Error ? cause.message : 'Không thể gia hạn.' }); }
		redirect(303, '/loans?updated=1');
	}
};
