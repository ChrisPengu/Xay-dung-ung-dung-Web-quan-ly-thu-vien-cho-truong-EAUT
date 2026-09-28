<script lang='ts'>
	import { ClipboardList, Plus } from '@lucide/svelte';
	import { dateVi } from '$lib/format';
	let { data, form } = $props();
</script>

<div class='page-head'>
	<div><div class='eyebrow'>THEO DÕI TÀI LIỆU</div><h1>{data.isStaff ? 'Mượn - trả sách' : 'Sách của tôi'}</h1><p>{data.isStaff ? 'Theo dõi phiếu mượn, hạn trả và xử lý gia hạn.' : 'Xem các cuốn sách bạn đã và đang mượn.'}</p></div>
	{#if data.isStaff}<a class='button' href='/loans/new'><Plus size={16} /> Lập phiếu mượn</a>{/if}
</div>
{#if form?.message}<div class='alert error' role='alert'>{form.message}</div>{/if}
{#if data.updated}<div class='alert success' role='status'>Đã cập nhật phiếu mượn.</div>{/if}
<section class='card'>
	{#if data.loans.length}
		<div class='table-wrap'><table><thead><tr><th>Sách / bản sách</th>{#if data.isStaff}<th>Độc giả</th>{/if}<th>Ngày mượn</th><th>Hạn trả</th><th>Trạng thái</th>{#if data.isStaff}<th>Thao tác</th>{/if}</tr></thead><tbody>
			{#each data.loans as loan}
				<tr>
					<td><strong>{loan.title}</strong><br /><span class='muted'>{loan.accession_no}</span></td>
					{#if data.isStaff}<td><strong>{loan.reader_name}</strong><br /><span class='muted'>{loan.reader_code}</span></td>{/if}
					<td>{dateVi(loan.borrowed_at)}</td><td>{dateVi(loan.due_at)}</td>
					<td><span class:green={!!loan.returned_at} class:red={!loan.returned_at && new Date(loan.due_at) < new Date()} class:amber={!loan.returned_at && new Date(loan.due_at) >= new Date()} class='badge'>{loan.returned_at ? 'Đã trả' : new Date(loan.due_at) < new Date() ? 'Quá hạn' : 'Đang mượn'}</span></td>
					{#if data.isStaff}<td>
						{#if !loan.returned_at}
							<div style='display:flex;gap:7px'>
								<form method='POST' action='?/return'><input type='hidden' name='id' value={loan.id} /><button class='button button-small' type='submit'>Trả sách</button></form>
								<form method='POST' action='?/renew'><input type='hidden' name='id' value={loan.id} /><button class='button button-small button-secondary' type='submit' disabled={loan.renewals >= 1}>Gia hạn</button></form>
							</div>
						{:else}<span class='muted'>Hoàn tất</span>{/if}
					</td>{/if}
				</tr>
			{/each}
		</tbody></table></div>
	{:else}<div class='empty'><ClipboardList size={30} /><strong>Chưa có lượt mượn nào</strong><span>Các phiếu mượn sẽ xuất hiện tại đây.</span></div>{/if}
</section>
