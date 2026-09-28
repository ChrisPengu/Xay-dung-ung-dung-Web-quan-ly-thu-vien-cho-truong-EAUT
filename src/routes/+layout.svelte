<script lang='ts'>
	import '../app.css';
	import { page } from '$app/state';
	import { BookOpen, LayoutDashboard, ClipboardList, UsersRound, LogOut, UserRound, Menu } from '@lucide/svelte';
	import favicon from '$lib/assets/favicon.svg';
	let { data, children } = $props();
	let mobileOpen = $state(false);
	const staff = $derived(data.user?.role === 'ADMIN' || data.user?.role === 'LIBRARIAN');
	const links = $derived(data.user ? [
		{ href: '/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
		{ href: '/catalog', label: staff ? 'Đầu sách & bản sách' : 'Kho sách', icon: BookOpen },
		{ href: '/loans', label: staff ? 'Phiếu mượn - trả' : 'Sách của tôi', icon: ClipboardList },
		...(staff ? [{ href: '/readers', label: 'Quản lý độc giả', icon: UsersRound }] : []),
		{ href: '/account', label: 'Tài khoản', icon: UserRound }
	] : []);
</script>

<svelte:head>
	<link rel='icon' href={favicon} />
	<title>Thư viện EAUT</title>
	<meta name='description' content='Không gian tra cứu và quản lý thư viện dành cho cộng đồng EAUT' />
</svelte:head>

<div class:authenticated={!!data.user} class='app'>
	{#if data.user}
		<aside class:open={mobileOpen} class='sidebar'>
			<a class='brand brand-light' href='/dashboard' aria-label='Thư viện EAUT - Trang chủ'>
				<img class='brand-logo' src='/eaut-logo.png' alt='Đại học Công nghệ Đông Á' />
				<span class='brand-caption'>HỆ THỐNG QUẢN LÝ THƯ VIỆN</span>
			</a>
			<div class='sidebar-label'>DANH MỤC QUẢN LÝ</div>
			<nav aria-label='Điều hướng chính'>
				{#each links as link}
					<a href={link.href} class:active={page.url.pathname.startsWith(link.href)} onclick={() => mobileOpen = false}>
						<link.icon size={19} strokeWidth={1.8} />{link.label}
					</a>
				{/each}
			</nav>
			<div class='sidebar-bottom'>
				<p class='sidebar-note'>Bản demo học tập - không phải hệ thống chính thức của EAUT.</p>
				<div class='sidebar-user'><span class='avatar'>{data.user.full_name.slice(0, 1)}</span><span><strong>{data.user.full_name}</strong><small>{staff ? 'Thủ thư / Quản trị' : 'Độc giả'}</small></span></div>
				<form method='POST' action='/logout'><button class='logout' type='submit'><LogOut size={18} /> Đăng xuất</button></form>
			</div>
		</aside>
		{#if mobileOpen}<button class='sidebar-scrim' aria-label='Đóng menu' onclick={() => mobileOpen = false}></button>{/if}
	{/if}
	<div class='main-area'>
		<header class='topbar'>
			{#if data.user}
				<button class='mobile-menu' aria-label='Mở menu' onclick={() => mobileOpen = !mobileOpen}><Menu size={22} /></button>
				<div class='topbar-context'>Thư viện EAUT <span class='topbar-divider'>/</span> {staff ? 'Không gian quản lý' : 'Không gian độc giả'}</div>
				<a class='topbar-profile' href='/account'><span class='avatar small'>{data.user.full_name.slice(0, 1)}</span><span>{data.user.full_name}</span></a>
			{:else}
				<a class='brand public-brand' href='/catalog'><img class='brand-logo' src='/eaut-logo.png' alt='Đại học Công nghệ Đông Á' /><span class='brand-caption'>THƯ VIỆN - BẢN DEMO</span></a>
				<nav class='public-nav'><a href='/catalog'>Khám phá sách</a><a class='button button-small' href='/login'>Đăng nhập</a></nav>
			{/if}
		</header>
		<main id='main-content' class='content'>{@render children()}</main>
	</div>
</div>
