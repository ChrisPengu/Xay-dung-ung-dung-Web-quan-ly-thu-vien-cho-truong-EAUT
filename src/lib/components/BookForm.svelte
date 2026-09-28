<script lang='ts'>
	import { Save, ArrowLeft } from '@lucide/svelte';
	import type { BookInput } from '$lib/server/library';
	let { book, message, actionLabel }: { book?: Partial<BookInput>; message?: string; actionLabel: string } = $props();
</script>

<div class='card card-pad' style='max-width:850px'>
	{#if message}<div class='alert error' role='alert'>{message}</div>{/if}
	<form method='POST'>
		<div class='form-grid'>
			<div class='form-row'><label for='code'>Mã đầu sách *</label><input class='field' id='code' name='code' value={book?.code ?? ''} required minlength='3' maxlength='32' placeholder='VD: E-LIB-009' /><span class='hint'>Dùng để nhận diện đầu sách trong thư viện.</span></div>
			<div class='form-row'><label for='isbn'>ISBN</label><input class='field' id='isbn' name='isbn' value={book?.isbn ?? ''} maxlength='17' placeholder='VD: 978604...' /></div>
			<div class='form-row full'><label for='title'>Tên sách *</label><input class='field' id='title' name='title' value={book?.title ?? ''} required minlength='2' maxlength='200' placeholder='Nhập tên đầy đủ của cuốn sách' /></div>
			<div class='form-row'><label for='author'>Tác giả *</label><input class='field' id='author' name='author' value={book?.author ?? ''} required minlength='2' maxlength='120' placeholder='Tên tác giả hoặc nhóm tác giả' /></div>
			<div class='form-row'><label for='category'>Thể loại *</label><input class='field' id='category' name='category' value={book?.category ?? ''} required maxlength='80' placeholder='VD: Công nghệ thông tin' /></div>
			<div class='form-row'><label for='publisher'>Nhà xuất bản</label><input class='field' id='publisher' name='publisher' value={book?.publisher ?? ''} maxlength='120' /></div>
			<div class='form-row'><label for='publishedYear'>Năm xuất bản</label><input class='field' id='publishedYear' name='publishedYear' type='number' min='1450' max='2100' value={book?.publishedYear ?? ''} /></div>
			<div class='form-row full'><label for='description'>Giới thiệu ngắn</label><textarea class='textarea' id='description' name='description' maxlength='2000' placeholder='Cuốn sách này nói về điều gì? Bạn có thể ghi vài dòng để độc giả dễ chọn.'>{book?.description ?? ''}</textarea></div>
			<div class='form-row'><label for='coverColor'>Màu bìa trên giao diện</label><input class='field' id='coverColor' name='coverColor' type='color' value={book?.coverColor ?? '#c9e4df'} style='max-width:110px;padding:5px' /></div>
		</div>
		<div class='form-actions'><a class='button button-secondary' href='/catalog'><ArrowLeft size={15} /> Quay lại</a><button class='button' type='submit'><Save size={15} /> {actionLabel}</button></div>
	</form>
</div>
