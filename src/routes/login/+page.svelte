<script lang='ts'>
	import { LockKeyhole, ArrowRight } from '@lucide/svelte';
	let { form } = $props();
</script>

<div class='login-wrap'>
	<div class='eyebrow'>CHÀO MỪNG QUAY LẠI</div>
	<h1>Đăng nhập thư viện</h1>
	<p class='lead'>Tiếp tục hành trình tìm sách, quản lý mượn trả và khám phá tri thức cùng EAUT.</p>
	<div class='card'>
		<form method='POST'>
			{#if form?.message}<div class='alert error' role='alert'>{form.message}</div>{/if}
			<div class='form-row'><label for='email'>Email</label><input class='field' id='email' name='email' type='email' value={form?.email ?? ''} required autocomplete='username' placeholder='ban@eaut.edu.vn' /></div>
			<div class='form-row'><label for='password'>Mật khẩu</label><input class='field' id='password' name='password' type='password' required autocomplete='current-password' placeholder='Nhập mật khẩu' /></div>
			<button class='button' type='submit'><LockKeyhole size={16} /> Đăng nhập <ArrowRight size={16} /></button>
		</form>
		<div class='login-demo'><strong>Tài khoản trình bày</strong><br />Admin Vũ Mười: vumuoi@eaut.edu.vn<br />Thủ thư Bá Hiếu: bahieu@eaut.edu.vn<br />Bạn đọc Qang Minh: qangminh@eaut.edu.vn<br />Mật khẩu chung: Demo123!<br /><small>Đây là tài khoản mẫu, không dùng email EAUT thật.</small></div>
	</div>
</div>
