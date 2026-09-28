import type { Book, User } from './db';
import type { BookInput } from './library';
import { value } from './guards';

export function readBookForm(data: FormData): BookInput {
	const year = value(data, 'publishedYear');
	return {
		code: value(data, 'code').toUpperCase(),
		isbn: value(data, 'isbn'),
		title: value(data, 'title'),
		author: value(data, 'author'),
		category: value(data, 'category'),
		publisher: value(data, 'publisher'),
		publishedYear: year ? Number(year) : null,
		description: value(data, 'description'),
		coverColor: value(data, 'coverColor') || '#c9e4df'
	};
}

export function bookToInput(book: Book): BookInput {
	return {
		code: book.code, isbn: book.isbn ?? '', title: book.title, author: book.author,
		category: book.category, publisher: book.publisher,
		publishedYear: book.published_year, description: book.description,
		coverColor: book.cover_color
	};
}
