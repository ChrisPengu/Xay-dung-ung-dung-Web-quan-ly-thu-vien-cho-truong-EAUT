<script lang='ts'>
	import BookForm from '$lib/components/BookForm.svelte';
	let { form } = $props();
</script>
<div class='page-head'><div><div class='eyebrow'>QUẢN LÝ KHO SÁCH</div><h1>Thêm đầu sách mới</h1><p>Điền những thông tin cơ bản, sau đó thêm từng bản sách vào kho.</p></div></div>
<BookForm book={form?.input} message={form?.message} actionLabel='Lưu đầu sách' />
