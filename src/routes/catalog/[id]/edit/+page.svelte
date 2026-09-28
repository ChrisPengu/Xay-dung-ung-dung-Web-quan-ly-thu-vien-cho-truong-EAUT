<script lang='ts'>
	import BookForm from '$lib/components/BookForm.svelte';
	let { data, form } = $props();
</script>
<div class='page-head'><div><div class='eyebrow'>QUẢN LÝ KHO SÁCH</div><h1>Chỉnh sửa đầu sách</h1><p>Cập nhật thông tin, mã sách và mô tả cho phù hợp.</p></div></div>
<BookForm book={form?.input ?? data.book} message={form?.message} actionLabel='Lưu thay đổi' />
