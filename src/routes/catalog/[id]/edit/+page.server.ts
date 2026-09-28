import { error, fail, redirect } from '@sveltejs/kit';
import { bookToInput, readBookForm } from '$lib/server/forms';
import { requireStaff } from '$lib/server/guards';
import { library } from '$lib/server/library';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params, locals }) => {
	requireStaff(locals.user);
	const book = library.getBook(Number(params.id));
	if (!book) error(404, 'Không tìm thấy đầu sách.');
	return { book: bookToInput(book), id: book.id };
};

export const actions: Actions = {
	default: async ({ params, locals, request }) => {
		requireStaff(locals.user);
		const input = readBookForm(await request.formData());
		try { library.updateBook(Number(params.id), input); }
		catch (cause) { return fail(400, { message: cause instanceof Error ? cause.message : 'Không thể cập nhật sách.', input }); }
		redirect(303, `/catalog/${params.id}`);
	}
};
