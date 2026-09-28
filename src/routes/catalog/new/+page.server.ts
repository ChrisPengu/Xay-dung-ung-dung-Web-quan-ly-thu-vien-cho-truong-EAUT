import { fail, redirect } from '@sveltejs/kit';
import { library } from '$lib/server/library';
import { readBookForm } from '$lib/server/forms';
import { requireStaff } from '$lib/server/guards';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	requireStaff(locals.user);
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		requireStaff(locals.user);
		const input = readBookForm(await request.formData());
		let id: number;
		try { id = library.createBook(input); }
		catch (cause) { return fail(400, { message: cause instanceof Error ? cause.message : 'Không thể thêm sách.', input }); }
		redirect(303, `/catalog/${id}`);
	}
};
