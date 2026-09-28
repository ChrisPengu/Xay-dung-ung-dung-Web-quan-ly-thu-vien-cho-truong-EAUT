<script lang='ts'>
	import { UserRound, LockKeyhole, Save } from '@lucide/svelte';
	let { data, form } = $props();
</script>

<div class='page-head'><div><div class='eyebrow'>KHÔNG GIAN CỦA BẠN</div><h1>Hồ sơ tài khoản</h1><p>Giữ thông tin liên hệ và mật khẩu của bạn luôn cập nhật.</p></div></div>
{#if form?.message}<div class='alert error' role='alert'>{form.message}</div>{/if}
{#if data.saved}<div class='alert success' role='status'>Thông tin của bạn đã được lưu.</div>{/if}
<div class='grid-2'>
	<section class='card card-pad'>
		<div class='section-head'><div><h2>Thông tin cá nhân</h2><p>Mã tài khoản: {data.user.code}</p></div><UserRound size={20} color='#1e3769' /></div>
		<form method='POST' action='?/profile' class='stack'>
			<div class='form-row'><label for='profileName'>Họ và tên</label><input class='field' id='profileName' name='name' value={data.user.full_name} required minlength='2' maxlength='100' /></div>
			<div class='form-row'><label for='profileEmail'>Email EAUT</label><input class='field' id='profileEmail' name='email' type='email' value={data.user.email} required /><span class='hint'>Dùng địa chỉ có đuôi @eaut.edu.vn.</span></div>
			<div class='form-row'><span class='field-label'>Vai trò</span><div class='field' style='background:#f7f9f8'>{data.user.role === 'ADMIN' ? 'Quản trị viên' : data.user.role === 'LIBRARIAN' ? 'Thủ thư' : 'Độc giả'}</div></div>
			<button class='button' type='submit'><Save size={16} /> Lưu thông tin</button>
		</form>
	</section>
	<section class='card card-pad'>
		<div class='section-head'><div><h2>Đổi mật khẩu</h2><p>Nên dùng mật khẩu riêng, không chia sẻ với người khác</p></div><LockKeyhole size={20} color='#1e3769' /></div>
		<form method='POST' action='?/password' class='stack'>
			<div class='form-row'><label for='oldPassword'>Mật khẩu hiện tại</label><input class='field' id='oldPassword' name='oldPassword' type='password' required autocomplete='current-password' /></div>
			<div class='form-row'><label for='newPassword'>Mật khẩu mới</label><input class='field' id='newPassword' name='newPassword' type='password' required minlength='8' autocomplete='new-password' /><span class='hint'>Ít nhất 8 ký tự. Sau khi đổi, bạn sẽ cần đăng nhập lại.</span></div>
			<button class='button button-secondary' type='submit'>Đổi mật khẩu</button>
		</form>
	</section>
</div>
