import { expect, it } from 'vitest';
import { isEautEmail } from '../../src/lib/server/validation';

it('chấp nhận email EAUT và không phân biệt chữ hoa', () => {
	expect(isEautEmail('SinhVien@EAUT.EDU.VN')).toBe(true);
	expect(isEautEmail('sinhvien@eaut.edu.vn')).toBe(true);
});

it('từ chối email ngoài tên miền EAUT hoặc tên miền gần giống', () => {
	expect(isEautEmail('sinhvien@gmail.com')).toBe(false);
	expect(isEautEmail('sinhvien@demo.eaut.local')).toBe(false);
	expect(isEautEmail('sinhvien@fake-eaut.edu.vn')).toBe(false);
});
