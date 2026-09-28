export function isEautEmail(email: string): boolean {
	return /^[^\s@]+@eaut\.edu\.vn$/i.test(email.trim());
}
