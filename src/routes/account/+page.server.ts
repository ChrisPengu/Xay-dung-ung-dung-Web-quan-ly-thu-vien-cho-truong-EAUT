import { fail, redirect } from '@sveltejs/kit';
import { db, hashPassword } from '$lib/server/db';
import { signOut, verifyPassword } from '$lib/server/auth';
import { requireUser, value } from '$lib/server/guards';
import { isEautEmail } from '$lib/server/validation';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals, url }) => ({
	user: requireUser(locals.user),
	saved: url.searchParams.get('saved') === '1'
});

export const actions: Actions = {
	profile: async ({ locals, request }) => {
		const user = requireUser(locals.user);
		const data = await request.formData();
		const name = value(data, 'name');
		const email = value(data, 'email').toLowerCase();
		if (name.length < 2 || name.length > 100) return fail(400, { message: 'Họ tên cần từ 2 đến 100 ký tự.' });
		if (!isEautEmail(email)) return fail(400, { message: 'Vui lòng dùng email @eaut.edu.vn.' });
		try { db.prepare('UPDATE users SET full_name=?,email=? WHERE id=?').run(name,email,user.id); }
		catch { return fail(400, { message: 'Email này đã được sử dụng.' }); }
		redirect(303, '/account?saved=1');
	},
	password: async ({ locals, request, cookies }) => {
		const user = requireUser(locals.user);
		const data = await request.formData();
		const oldPassword = value(data, 'oldPassword');
		const newPassword = value(data, 'newPassword');
		const record = db.prepare('SELECT password_hash FROM users WHERE id=?').get(user.id) as { password_hash: string };
		if (!verifyPassword(oldPassword, record.password_hash)) return fail(400, { message: 'Mật khẩu hiện tại chưa đúng.' });
		if (newPassword.length < 8) return fail(400, { message: 'Mật khẩu mới cần ít nhất 8 ký tự.' });
		db.prepare('UPDATE users SET password_hash=? WHERE id=?').run(hashPassword(newPassword),user.id);
		db.prepare('DELETE FROM sessions WHERE user_id=?').run(user.id);
		signOut(cookies);
		redirect(303, '/login');
	}
};
