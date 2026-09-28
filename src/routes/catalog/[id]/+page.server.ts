import { error, fail, redirect } from '@sveltejs/kit';
import { library } from '$lib/server/library';
import { requireStaff, value } from '$lib/server/guards';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params, locals, url }) => {
	const id = Number(params.id);
	const book = library.getBook(id);
	if (!book) error(404, 'Không tìm thấy đầu sách.');
	return {
		book,
		copies: library.listCopies(id),
		isStaff: locals.user?.role === 'ADMIN' || locals.user?.role === 'LIBRARIAN',
		added: url.searchParams.get('added') === '1',
		updated: url.searchParams.get('updated') === '1'
	};
};

export const actions: Actions = {
	addCopy: async ({ params, locals, request }) => {
		requireStaff(locals.user);
		const form = await request.formData();
		try {
			library.addCopy(Number(params.id), value(form, 'accessionNo'), value(form, 'shelf'));
		} catch (cause) {
			return fail(400, { message: cause instanceof Error ? cause.message : 'Không thể thêm bản sách.' });
		}
		redirect(303, `/catalog/${params.id}?added=1`);
	},
	updateCopy: async ({ params, locals, request }) => {
		requireStaff(locals.user);
		const form = await request.formData();
		const condition = value(form, 'condition');
		if (condition !== 'GOOD' && condition !== 'DAMAGED' && condition !== 'LOST')
			return fail(400, { message: 'Tình trạng bản sách không hợp lệ.' });
		const copyId = Number(value(form, 'id'));
		if (!library.listCopies(Number(params.id)).some((copy) => copy.id === copyId))
			return fail(404, { message: 'Bản sách không thuộc đầu sách này.' });
		try { library.updateCopy(copyId, value(form, 'shelf'), condition); }
		catch (cause) { return fail(400, { message: cause instanceof Error ? cause.message : 'Không thể sửa bản sách.' }); }
		redirect(303, `/catalog/${params.id}?updated=1`);
	},
	archive: async ({ params, locals }) => {
		requireStaff(locals.user);
		try { library.archiveBook(Number(params.id)); }
		catch (cause) { return fail(400, { message: cause instanceof Error ? cause.message : 'Không thể lưu trữ đầu sách.' }); }
		redirect(303, '/catalog');
	}
};
