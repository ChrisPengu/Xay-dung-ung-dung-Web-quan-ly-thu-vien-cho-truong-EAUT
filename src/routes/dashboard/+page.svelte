<script lang='ts'>
	import { BookOpen, BookCheck, Clock3, UsersRound, ClipboardList, ArrowUpRight, Plus, Search } from '@lucide/svelte';
	import { dateVi } from '$lib/format';
	let { data } = $props();
</script>

<div class='page-head'>
	<div><div class='eyebrow'>{data.isStaff ? 'TỔNG QUAN VẬN HÀNH' : 'KHÔNG GIAN ĐỘC GIẢ'}</div><h1>{data.isStaff ? 'Tổng quan thư viện' : 'Sách và lượt mượn của bạn'}</h1><p>{data.isStaff ? 'Theo dõi kho sách, độc giả và các phiếu cần xử lý trong ngày.' : 'Xem sách đang mượn và tìm tài liệu mới.'}</p></div>
	{#if data.isStaff}<a class='button' href='/loans/new'><Plus size={16} /> Lập phiếu mượn</a>{:else}<a class='button' href='/catalog'><Search size={16} /> Tìm sách</a>{/if}
</div>

{#if data.isStaff}
	<nav class='quick-actions' aria-label='Thao tác quản lý nhanh'>
		<a href='/catalog/new'><Plus size={17} /> Thêm đầu sách</a>
		<a href='/readers'><UsersRound size={17} /> Quản lý độc giả</a>
		<a href='/loans'><ClipboardList size={17} /> Theo dõi phiếu mượn</a>
	</nav>
{/if}

<div class='grid-4'>
	<div class='card stat'><div class='stat-icon'><BookOpen size={19} /></div><strong>{data.stats.books}</strong><span>Đầu sách</span></div>
	<div class='card stat'><div class='stat-icon'><BookCheck size={19} /></div><strong>{data.stats.copies}</strong><span>Bản sách sẵn có</span></div>
	<div class='card stat'><div class='stat-icon'><Clock3 size={19} /></div><strong>{data.isStaff ? data.stats.activeLoans : data.loans.length}</strong><span>Đang được mượn</span></div>
	<div class='card stat'><div class='stat-icon'><UsersRound size={19} /></div><strong>{data.isStaff ? data.stats.readers : data.readerOverdue}</strong><span>{data.isStaff ? 'Độc giả đang hoạt động' : 'Lượt quá hạn'}</span></div>
</div>

<div class='grid-2' style='margin-top:22px'>
	<section class='card card-pad'>
		<div class='section-head'><div><h2>{data.isStaff ? 'Phiếu mượn gần đây' : 'Sách đang mượn'}</h2><p>Theo dõi hạn trả thật dễ dàng</p></div><a class='text-link' href='/loans'>Xem tất cả →</a></div>
		{#if data.loans.length}
			<div class='table-wrap'><table><thead><tr><th>Tài liệu</th><th>Hạn trả</th><th>Trạng thái</th></tr></thead><tbody>
				{#each data.loans as loan}<tr><td><strong>{loan.title}</strong><br /><span class='muted'>{loan.accession_no}</span></td><td>{dateVi(loan.due_at)}</td><td><span class:red={new Date(loan.due_at) < new Date()} class:green={new Date(loan.due_at) >= new Date()} class='badge'>{new Date(loan.due_at) < new Date() ? 'Quá hạn' : 'Đang mượn'}</span></td></tr>{/each}
			</tbody></table></div>
		{:else}<div class='empty'><Clock3 size={27} /><strong>Chưa có phiếu mượn nào</strong><span>Khi có lượt mượn, thông tin sẽ xuất hiện ở đây.</span></div>{/if}
	</section>
	<section class='card card-pad'>
		<div class='section-head'><div><h2>Sách mới trong kho</h2><p>Một vài gợi ý bạn có thể cần</p></div><a class='text-link' href='/catalog'>Khám phá →</a></div>
		<div class='stack'>
			{#each data.books as book}
				<a class='book-line' href='/catalog/{book.id}'><span class='book-cover' style:background={book.cover_color}><BookOpen size={24} /></span><span style='flex:1'><strong>{book.title}</strong><small>{book.author}</small></span><ArrowUpRight size={16} color='#88a29d' /></a>
			{/each}
		</div>
	</section>
</div>
