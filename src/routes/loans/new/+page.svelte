<script lang='ts'>
	import { ArrowLeft, Plus } from '@lucide/svelte';
	let { data, form } = $props();
</script>
<div class='page-head'><div><div class='eyebrow'>QUẢN LÝ MƯỢN SÁCH</div><h1>Lập phiếu mượn mới</h1><p>Chọn độc giả và một bản sách đang có sẵn. Hạn trả mặc định sau 14 ngày.</p></div></div>
<div class='card card-pad' style='max-width:700px'>
	{#if form?.message}<div class='alert error' role='alert'>{form.message}</div>{/if}
	<form method='POST' class='stack'>
		<div class='form-row'><label for='readerId'>Độc giả *</label><select class='select' id='readerId' name='readerId' required><option value=''>Chọn độc giả</option>{#each data.readers as reader}<option value={reader.id}>{reader.full_name} - {reader.code} ({reader.active_loans} đang mượn)</option>{/each}</select></div>
		<div class='form-row'><label for='copyId'>Bản sách *</label><select class='select' id='copyId' name='copyId' required><option value=''>Chọn bản sách có sẵn</option>{#each data.copies as copy}<option value={copy.id}>{copy.title} - {copy.accession_no} - Kệ {copy.shelf}</option>{/each}</select></div>
		<p class='hint'>Hệ thống tự kiểm tra sách còn sẵn, tài khoản độc giả, số sách đã mượn và tình trạng quá hạn trước khi lưu.</p>
		<div class='form-actions'><a class='button button-secondary' href='/loans'><ArrowLeft size={15} /> Quay lại</a><button class='button' type='submit'><Plus size={15} /> Tạo phiếu mượn</button></div>
	</form>
</div>
