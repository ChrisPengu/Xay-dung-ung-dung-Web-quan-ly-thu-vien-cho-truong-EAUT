import { expect, test } from '@playwright/test';

test('ST-01 - khách tra cứu và lọc sách', async ({ page }) => {
	await page.goto('/catalog');
	await expect(page.getByRole('heading', { name: 'Khám phá kho sách' })).toBeVisible();
	await page.getByRole('textbox', { name: 'Tìm nhanh' }).fill('Clean Code');
	await page.getByRole('button', { name: 'Lọc kết quả' }).click();
	await expect(page.getByText('Clean Code', { exact: true })).toBeVisible();
});

test('ST-02 - thủ thư thêm sách, thêm bản, lập phiếu và trả', async ({ page }) => {
	await page.goto('/login');
	await page.getByLabel('Email').fill('bahieu@eaut.edu.vn');
	await page.getByLabel('Mật khẩu').fill('Demo123!');
	await page.getByRole('button', { name: 'Đăng nhập' }).click();
	await expect(page).toHaveURL(/dashboard/);
	await page.screenshot({ path: 'test-results/dashboard-desktop.png', fullPage: true });

	await page.goto('/catalog/new');
	await page.getByLabel('Mã đầu sách').fill('E2E-001');
	await page.getByLabel('Tên sách').fill('Sách kiểm thử giao diện');
	await page.getByLabel('Tác giả').fill('Nhóm EAUT');
	await page.getByLabel('Thể loại').fill('Kiểm thử');
	await page.getByRole('button', { name: 'Lưu đầu sách' }).click();
	await expect(page.getByRole('heading', { name: 'Sách kiểm thử giao diện', level: 1 })).toBeVisible();

	await page.getByLabel('Mã bản sách').fill('E2E-COPY-01');
	await page.getByLabel('Vị trí kệ').fill('T-01');
	await page.getByRole('button', { name: 'Thêm bản' }).click();
	await expect(page.getByText('E2E-COPY-01')).toBeVisible();

	await page.goto('/readers');
	await page.getByLabel('Mã độc giả').fill('SV-E2E01');
	await page.getByLabel('Họ và tên').fill('Sinh viên kiểm thử');
	await page.getByLabel('Email EAUT').fill('e2e@eaut.edu.vn');
	await page.getByLabel('Mật khẩu ban đầu').fill('Test1234!');
	await page.getByRole('button', { name: 'Tạo tài khoản độc giả' }).click();
	await expect(page.getByText('SV-E2E01')).toBeVisible();

	await page.goto('/loans/new');
	const reader = await page.locator('#readerId option').filter({ hasText: 'SV-E2E01' }).getAttribute('value');
	const copy = await page.locator('#copyId option').filter({ hasText: 'E2E-COPY-01' }).getAttribute('value');
	await page.locator('#readerId').selectOption(reader ?? '');
	await page.locator('#copyId').selectOption(copy ?? '');
	await page.getByRole('button', { name: 'Tạo phiếu mượn' }).click();
	const row = page.getByRole('row').filter({ hasText: 'E2E-COPY-01' });
	await expect(row).toContainText('Đang mượn');
	await row.getByRole('button', { name: 'Trả sách' }).click();
	await expect(page.getByRole('row').filter({ hasText: 'E2E-COPY-01' })).toContainText('Đã trả');
});

test('ST-03 - độc giả không vào được trang thủ thư', async ({ page }) => {
	await page.goto('/login');
	await page.getByLabel('Email').fill('qangminh@eaut.edu.vn');
	await page.getByLabel('Mật khẩu').fill('Demo123!');
	await page.getByRole('button', { name: 'Đăng nhập' }).click();
	await expect(page).toHaveURL(/dashboard/);
	await expect(page.getByRole('heading', { name: 'Sách của tôi' })).not.toBeVisible();
	const readers = await page.goto('/readers');
	expect(readers?.status()).toBe(403);
	const manageBook = await page.goto('/catalog/new');
	expect(manageBook?.status()).toBe(403);
	await page.goto('/loans');
	await expect(page.getByRole('heading', { name: 'Sách của tôi' })).toBeVisible();
});

test('ST-04 - kho sách dùng được trên điện thoại', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/catalog');
	await expect(page.getByRole('heading', { name: 'Khám phá kho sách' })).toBeVisible();
	const sizes = await page.evaluate(() => ({
		viewport: window.innerWidth,
		document: document.documentElement.scrollWidth
	}));
	expect(sizes.document).toBeLessThanOrEqual(sizes.viewport);
	await page.screenshot({ path: 'test-results/catalog-mobile.png', fullPage: true });
});

test('ST-05 - thủ thư quản lý tình trạng bản sách và khóa độc giả', async ({ page }) => {
	await page.goto('/login');
	await page.getByLabel('Email').fill('bahieu@eaut.edu.vn');
	await page.getByLabel('Mật khẩu').fill('Demo123!');
	await page.getByRole('button', { name: 'Đăng nhập' }).click();

	await page.goto('/catalog');
	await expect(page.getByRole('heading', { name: 'Quản lý đầu sách' })).toBeVisible();
	await page.screenshot({ path: 'test-results/catalog-staff-desktop.png', fullPage: true });
	await page.goto('/catalog/1');
	const copy = page.getByRole('row').filter({ hasText: 'EAUT-001-01' });
	await copy.getByRole('textbox', { name: 'Vị trí kệ của EAUT-001-01' }).fill('B-07');
	await copy.getByRole('combobox', { name: 'Tình trạng của EAUT-001-01' }).selectOption('DAMAGED');
	await copy.getByRole('button', { name: 'Lưu' }).click();
	await expect(copy).toContainText('Hỏng');
	await expect(copy).toContainText('Không sẵn có');
	await copy.getByRole('combobox', { name: 'Tình trạng của EAUT-001-01' }).selectOption('GOOD');
	await copy.getByRole('button', { name: 'Lưu' }).click();
	await expect(copy).toContainText('Có sẵn');
	await page.screenshot({ path: 'test-results/copies-desktop.png', fullPage: true });

	await page.goto('/readers');
	const reader = page.getByRole('row').filter({ hasText: 'qangminh@eaut.edu.vn' });
	page.once('dialog', (dialog) => dialog.accept());
	await reader.getByRole('button', { name: 'Khóa' }).click();
	await expect(reader).toContainText('Đã khóa');
	await reader.getByRole('button', { name: 'Mở lại' }).click();
	await expect(reader).toContainText('Đang hoạt động');
	await page.screenshot({ path: 'test-results/readers-desktop.png', fullPage: true });
	await page.setViewportSize({ width: 390, height: 844 });
	await page.reload();
	const sizes = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
	expect(sizes.document).toBeLessThanOrEqual(sizes.viewport);
	await page.screenshot({ path: 'test-results/readers-mobile.png', fullPage: true });
	await page.goto('/catalog/1');
	const copyPageSizes = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
	expect(copyPageSizes.document).toBeLessThanOrEqual(copyPageSizes.viewport);
	await page.screenshot({ path: 'test-results/copies-mobile.png', fullPage: true });
});

test('ST-06 - admin Vũ Mười đăng nhập và mở trang quản lý', async ({ page }) => {
	await page.goto('/login');
	await page.getByLabel('Email').fill('vumuoi@eaut.edu.vn');
	await page.getByLabel('Mật khẩu').fill('Demo123!');
	await page.getByRole('button', { name: 'Đăng nhập' }).click();
	await expect(page).toHaveURL(/dashboard/);
	await expect(page.getByRole('link', { name: 'Vũ Mười' })).toBeVisible();
	await page.goto('/readers');
	await expect(page.getByRole('heading', { name: 'Quản lý độc giả' })).toBeVisible();
});
