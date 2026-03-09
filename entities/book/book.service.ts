import { db } from "@/shared/db/db";
import { BookRecord } from "@/shared/db/db";

export async function addBook(file: File) {
  const id = crypto.randomUUID();

  const book: BookRecord = {
    id,
    title: file.name.replace(".epub", ""),
    file,
    createdAt: new Date().toISOString(),
  };

  await db.books.add(book);

  return book;
}

export async function getAllBooks() {
  return db.books.orderBy("createdAt").reverse().toArray();
}

export async function getBookById(id: string) {
  return db.books.get(id);
}

export async function updateLastOpened(id: string) {
  await db.books.update(id, {
    lastOpenedAt: new Date().toISOString(),
  });
}
