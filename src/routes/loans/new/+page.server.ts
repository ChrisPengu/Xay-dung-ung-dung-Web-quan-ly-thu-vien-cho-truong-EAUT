import { fail, redirect } from '@sveltejs/kit';
import { library } from '$lib/server/library';
import { requireStaff, value } from '$lib/server/guards';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	requireStaff(locals.user);
	return {
		readers: library.listReaders().filter((reader) => reader.status === 'ACTIVE'),
		copies: library.listCopies().filter((copy) => copy.status === 'AVAILABLE' && copy.condition === 'GOOD')
	};
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		requireStaff(locals.user);
		const form = await request.formData();
		try { library.issueLoan(Number(value(form, 'copyId')), Number(value(form, 'readerId'))); }
		catch (cause) { return fail(400, { message: cause instanceof Error ? cause.message : 'Không thể lập phiếu mượn.' }); }
		redirect(303, '/loans?updated=1');
	}
};
