<script lang='ts'>
	import { UsersRound, Plus, Mail, Search, UserLock, UserCheck } from '@lucide/svelte';
	let { data, form } = $props();
</script>

<div class='page-head'>
	<div><div class='eyebrow'>QUẢN LÝ THƯ VIỆN</div><h1>Quản lý độc giả</h1><p>Tìm tài khoản, theo dõi lượt mượn và khóa hoặc mở khi cần.</p></div>
</div>
{#if form?.message}<div class='alert error' role='alert'>{form.message}</div>{/if}
{#if data.created}<div class='alert success' role='status'>Đã tạo tài khoản độc giả.</div>{/if}
{#if data.updated}<div class='alert success' role='status'>Đã cập nhật trạng thái tài khoản.</div>{/if}

<div class='management-grid'>
	<section class='card card-pad'>
		<div class='section-head'><div><h2>Danh sách độc giả</h2><p>{data.readers.length} tài khoản phù hợp</p></div><UsersRound size={20} color='#1e3769' /></div>
		<form class='toolbar management-filter' method='GET' action='/readers'>
			<input class='field' name='q' value={data.search} placeholder='Mã, tên hoặc email độc giả' aria-label='Tìm độc giả' />
			<select class='select' name='status' aria-label='Lọc trạng thái tài khoản'>
				<option value=''>Mọi trạng thái</option>
				<option value='ACTIVE' selected={data.status === 'ACTIVE'}>Đang hoạt động</option>
				<option value='LOCKED' selected={data.status === 'LOCKED'}>Đã khóa</option>
			</select>
			<button class='button button-secondary' type='submit'><Search size={15} /> Lọc</button>
		</form>
		{#if data.readers.length}
			<p class='table-mobile-hint'>Vuốt bảng sang ngang để xem thêm thông tin và thao tác.</p>
			<div class='table-wrap'><table><thead><tr><th>Độc giả</th><th>Mã</th><th>Đang mượn</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>
				{#each data.readers as reader}
					<tr>
						<td><strong>{reader.full_name}</strong><br /><span class='muted'><Mail size={12} style='vertical-align:middle' /> {reader.email}</span></td>
						<td>{reader.code}</td>
						<td>{reader.active_loans} bản</td>
						<td><span class:green={reader.status === 'ACTIVE'} class:gray={reader.status === 'LOCKED'} class='badge'>{reader.status === 'ACTIVE' ? 'Đang hoạt động' : 'Đã khóa'}</span></td>
						<td><form method='POST' action='?/status' onsubmit={(event) => { if (reader.status === 'ACTIVE' && !confirm('Khóa tài khoản này? Các phiên đăng nhập sẽ bị kết thúc; phiếu mượn vẫn được giữ.')) event.preventDefault(); }}>
							<input type='hidden' name='id' value={reader.id} />
							<input type='hidden' name='status' value={reader.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE'} />
							<button class='button button-small button-secondary' type='submit'>
								{#if reader.status === 'ACTIVE'}<UserLock size={14} /> Khóa{:else}<UserCheck size={14} /> Mở lại{/if}
							</button>
						</form></td>
					</tr>
				{/each}
			</tbody></table></div>
		{:else}<div class='empty'><Search size={26} /><strong>Không có tài khoản phù hợp</strong><span>Thử từ khóa hoặc trạng thái khác.</span></div>{/if}
	</section>
	<section class='card card-pad'>
		<div class='section-head'><div><h2>Thêm độc giả</h2><p>Dùng mã sinh viên hoặc mã quản lý nội bộ</p></div></div>
		<form method='POST' action='?/create' class='reader-create-form'>
			<div class='form-row'><label for='readerCode'>Mã độc giả *</label><input class='field' id='readerCode' name='code' required minlength='4' maxlength='24' placeholder='VD: SV2026003' /></div>
			<div class='form-row'><label for='readerName'>Họ và tên *</label><input class='field' id='readerName' name='name' required minlength='2' maxlength='100' /></div>
			<div class='form-row'><label for='readerEmail'>Email EAUT *</label><input class='field' id='readerEmail' name='email' type='email' required placeholder='sinhvien@eaut.edu.vn' /></div>
			<div class='form-row'><label for='readerPassword'>Mật khẩu ban đầu *</label><input class='field' id='readerPassword' name='password' type='password' required minlength='8' autocomplete='new-password' /><span class='hint'>Chỉ gửi mật khẩu cho độc giả qua kênh riêng và nhắc đổi sau lần đăng nhập đầu.</span></div>
			<button class='button' type='submit'><Plus size={16} /> Tạo tài khoản độc giả</button>
		</form>
	</section>
</div>
