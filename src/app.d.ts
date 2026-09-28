// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { User } from '$lib/server/db';

declare global {
	namespace App {
		interface Locals {
			user: User | null;
		}
	}
}

export {};
