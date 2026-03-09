import Dexie, { type Table } from "dexie";

export interface BookRecord {
  id: string;
  title: string;
  file: Blob;
  createdAt: string;
  lastOpenedAt?: string;
  coverUrl?: string;
}

export interface ReadingProgressRecord {
  bookId: string;
  cfi: string;
  updatedAt: string;
}

class ReadAuraDB extends Dexie {
  books!: Table<BookRecord, string>;
  readingProgress!: Table<ReadingProgressRecord, string>;

  constructor() {
    super("ReadAuraDB");
    this.version(1).stores({
      books: "id, title, createdAt, lastOpenedAt",
      readingProgress: "bookId, updatedAt",
    });
  }
}

export const db = new ReadAuraDB();
