import { fail, redirect } from '@sveltejs/kit';
import { signIn } from '$lib/server/auth';
import { value } from '$lib/server/guards';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.user) redirect(303, '/dashboard');
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = value(data, 'email');
		const user = signIn(email, value(data, 'password'), cookies);
		if (!user) return fail(400, { message: 'Email hoặc mật khẩu chưa đúng.', email });
		redirect(303, '/dashboard');
	}
};
