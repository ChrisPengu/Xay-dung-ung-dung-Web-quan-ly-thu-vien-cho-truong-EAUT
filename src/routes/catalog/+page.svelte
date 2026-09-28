<script lang='ts'>
	import { BookOpen, Plus, Search, ArrowRight } from '@lucide/svelte';
	let { data } = $props();
</script>

{#if !data.isStaff}<section class='search-hero'>
	<div class='eyebrow' style='color:#e0e9ff'>KHO TRI THỨC EAUT</div>
	<h1>Một cuốn sách hay có thể mở ra nhiều điều mới.</h1>
	<p>Tìm tài liệu học tập, nghiên cứu và những cuốn sách bạn muốn đọc. Tra cứu tình trạng sách ngay tại đây.</p>
	<form method='GET' action='/catalog'>
		<input class='field' name='q' value={data.search} placeholder='Tên sách, tác giả, ISBN hoặc mã sách...' aria-label='Từ khóa tìm sách' />
		<button class='button' type='submit'><Search size={17} /> Tìm sách</button>
	</form>
</section>{/if}

<div class='page-head'>
	<div><div class='eyebrow'>{data.isStaff ? 'QUẢN LÝ THƯ VIỆN' : 'DANH MỤC TÀI LIỆU'}</div><h1>{data.isStaff ? 'Quản lý đầu sách' : 'Khám phá kho sách'}</h1><p>{data.books.length} đầu sách phù hợp với bộ lọc</p></div>
	{#if data.isStaff}<a class='button' href='/catalog/new'><Plus size={16} /> Thêm đầu sách</a>{/if}
</div>
<form class='toolbar' method='GET' action='/catalog'>
	<input class='field' name='q' value={data.search} placeholder='Tìm nhanh theo tên sách, tác giả...' aria-label='Tìm nhanh' />
	<select class='select' name='category' aria-label='Lọc thể loại'>
		<option value=''>Tất cả thể loại</option>
		{#each data.categories as category}<option value={category} selected={category === data.category}>{category}</option>{/each}
	</select>
	<button class='button button-secondary' type='submit'>Lọc kết quả</button>
</form>
{#if data.books.length}
	{#if data.isStaff}
		<section class='card'>
			<div class='table-wrap'><table><thead><tr><th>Đầu sách</th><th>Mã / ISBN</th><th>Thể loại</th><th>Bản còn / tổng</th><th>Quản lý</th></tr></thead><tbody>
				{#each data.books as book}<tr>
					<td><strong>{book.title}</strong><br /><span class='muted'>{book.author}</span></td>
					<td>{book.code}<br /><span class='muted'>{book.isbn || 'Chưa có ISBN'}</span></td>
					<td>{book.category}</td>
					<td><span class:green={book.available_copies > 0} class:gray={book.available_copies === 0} class='badge'>{book.available_copies} / {book.total_copies} bản</span></td>
					<td><a class='text-link' href='/catalog/{book.id}'>Xem & quản lý</a></td>
				</tr>{/each}
			</tbody></table></div>
		</section>
	{:else}
	<div class='catalog-grid'>
		{#each data.books as book}
			<a class='catalog-card card' href='/catalog/{book.id}'>
				<span class='book-cover' style:background={book.cover_color}><BookOpen size={27} strokeWidth={1.5} /></span>
				<div><strong>{book.title}</strong><p>{book.author}</p></div>
				<div class='card-foot'><span class='category'>{book.category}</span><span class:green={book.available_copies > 0} class:gray={book.available_copies === 0} class='badge'>{book.available_copies > 0 ? `${book.available_copies} bản còn` : 'Đã hết'}</span></div>
			</a>
		{/each}
	</div>
	{/if}
{:else}
	<div class='card empty'><Search size={29} /><strong>Chưa tìm thấy cuốn sách phù hợp</strong><span>Thử từ khóa khác hoặc bỏ bớt bộ lọc nhé.</span><p style='margin-top:17px'><a class='button button-secondary' href='/catalog'>Xem tất cả sách <ArrowRight size={15} /></a></p></div>
{/if}
