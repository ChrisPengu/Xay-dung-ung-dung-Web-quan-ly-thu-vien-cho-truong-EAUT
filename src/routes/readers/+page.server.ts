import { fail, redirect } from '@sveltejs/kit';
import { library } from '$lib/server/library';
import { requireStaff, value } from '$lib/server/guards';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals, url }) => {
	requireStaff(locals.user);
	const search = url.searchParams.get('q') ?? '';
	const requestedStatus = url.searchParams.get('status') ?? '';
	const status = requestedStatus === 'ACTIVE' || requestedStatus === 'LOCKED' ? requestedStatus : '';
	return {
		readers: library.listReaders(search, status), search, status,
		created: url.searchParams.get('created') === '1',
		updated: url.searchParams.get('updated') === '1'
	};
};

export const actions: Actions = {
	create: async ({ locals, request }) => {
		requireStaff(locals.user);
		const form = await request.formData();
		try {
			library.createReader(value(form, 'code'), value(form, 'name'), value(form, 'email'), value(form, 'password'));
		} catch (cause) {
			return fail(400, { message: cause instanceof Error ? cause.message : 'Không thể thêm độc giả.' });
		}
		redirect(303, '/readers?created=1');
	},
	status: async ({ locals, request }) => {
		requireStaff(locals.user);
		const form = await request.formData();
		try {
			const status = value(form, 'status');
			if (status !== 'ACTIVE' && status !== 'LOCKED') throw new Error('Trạng thái tài khoản không hợp lệ.');
			library.setReaderStatus(Number(value(form, 'id')), status);
		} catch (cause) {
			return fail(400, { message: cause instanceof Error ? cause.message : 'Không thể cập nhật độc giả.' });
		}
		redirect(303, '/readers?updated=1');
	}
};
