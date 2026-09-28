<script lang='ts'>
	import { BookOpen, ArrowLeft, Pencil, Plus, MapPin, Hash } from '@lucide/svelte';
	let { data, form } = $props();
</script>

<a class='text-link' href='/catalog'><ArrowLeft size={15} style='vertical-align:middle' /> Quay lại kho sách</a>
<div class='page-head' style='margin-top:20px'>
	<div><div class='eyebrow'>CHI TIẾT ĐẦU SÁCH</div><h1>{data.book.title}</h1><p>{data.book.author}</p></div>
	{#if data.isStaff}<a class='button button-secondary' href='/catalog/{data.book.id}/edit'><Pencil size={15} /> Chỉnh sửa</a>{/if}
</div>
{#if form?.message}<div class='alert error' role='alert'>{form.message}</div>{/if}
{#if data.added}<div class='alert success' role='status'>Đã thêm bản sách mới vào kho.</div>{/if}
{#if data.updated}<div class='alert success' role='status'>Đã cập nhật vị trí và tình trạng bản sách.</div>{/if}
<div class='book-management-layout'>
	<section class='card card-pad detail-grid'>
		<div class='book-cover large' style:background={data.book.cover_color}><BookOpen size={68} strokeWidth={1.2} /></div>
		<div>
			<span class='badge green'>{data.book.available_copies} / {data.book.total_copies} bản còn</span>
			<h2 style='margin:17px 0 8px'>{data.book.title}</h2>
			<p class='lead'>{data.book.description || 'Cuốn sách đang chờ bổ sung phần giới thiệu.'}</p>
			<div class='detail-meta'>
				<div><small>Tác giả</small><strong>{data.book.author}</strong></div>
				<div><small>Thể loại</small><strong>{data.book.category}</strong></div>
				<div><small>Nhà xuất bản</small><strong>{data.book.publisher || 'Đang cập nhật'}</strong></div>
				<div><small>Năm xuất bản</small><strong>{data.book.published_year || 'Đang cập nhật'}</strong></div>
				<div><small>Mã sách</small><strong>{data.book.code}</strong></div>
				<div><small>ISBN</small><strong>{data.book.isbn || 'Không có'}</strong></div>
			</div>
		</div>
	</section>
	<section class='card card-pad'>
		<div class='section-head'><div><h2>Quản lý bản sách</h2><p>Vị trí và tình trạng từng bản trong kho</p></div></div>
		{#if data.copies.length}
			{#if data.isStaff}<p class='table-mobile-hint'>Vuốt bảng sang ngang để cập nhật từng bản sách.</p>{/if}
			<div class='table-wrap'><table><thead><tr><th>Mã cá biệt</th><th>Vị trí</th><th>Trạng thái</th>{#if data.isStaff}<th>Cập nhật kho</th>{/if}</tr></thead><tbody>
				{#each data.copies as copy}<tr>
					<td><strong><Hash size={13} style='vertical-align:middle' /> {copy.accession_no}</strong></td>
					<td><MapPin size={13} style='vertical-align:middle' /> {copy.shelf}<br /><span class='muted'>{copy.condition === 'GOOD' ? 'Tốt' : copy.condition === 'DAMAGED' ? 'Hỏng' : 'Mất'}</span></td>
					<td><span class:green={copy.status === 'AVAILABLE'} class:amber={copy.status === 'BORROWED'} class:gray={copy.status === 'UNAVAILABLE'} class='badge'>{copy.status === 'AVAILABLE' ? 'Có sẵn' : copy.status === 'BORROWED' ? 'Đang mượn' : 'Không sẵn có'}</span></td>
					{#if data.isStaff}<td>
						{#if copy.status === 'BORROWED'}<span class='muted'>Nhận trả trước khi sửa</span>
						{:else}<form method='POST' action='?/updateCopy' class='inline-management'>
							<input type='hidden' name='id' value={copy.id} />
							<input class='field' name='shelf' value={copy.shelf} aria-label='Vị trí kệ của {copy.accession_no}' required maxlength='40' />
							<select class='select' name='condition' aria-label='Tình trạng của {copy.accession_no}'>
								<option value='GOOD' selected={copy.condition === 'GOOD'}>Tốt</option>
								<option value='DAMAGED' selected={copy.condition === 'DAMAGED'}>Hỏng</option>
								<option value='LOST' selected={copy.condition === 'LOST'}>Mất</option>
							</select>
							<button class='button button-small button-secondary' type='submit'>Lưu</button>
						</form>{/if}
					</td>{/if}
				</tr>{/each}
			</tbody></table></div>
		{:else}<div class='empty'>Chưa có bản sách vật lý.</div>{/if}
		{#if data.isStaff}
			<form method='POST' action='?/addCopy' class='toolbar' style='margin-top:20px;margin-bottom:0'>
				<input class='field' name='accessionNo' placeholder='Mã bản sách' aria-label='Mã bản sách' required maxlength='32' />
				<input class='field' name='shelf' placeholder='Vị trí kệ' aria-label='Vị trí kệ' required maxlength='40' />
				<button class='button' type='submit'><Plus size={15} /> Thêm bản</button>
			</form>
		{/if}
	</section>
</div>
{#if data.isStaff}
	<form method='POST' action='?/archive' style='margin-top:20px' onsubmit={(event) => { if (!confirm('Bạn muốn lưu trữ đầu sách này?')) event.preventDefault(); }}>
		<button class='button button-danger' type='submit'>Lưu trữ đầu sách</button>
	</form>
{/if}
