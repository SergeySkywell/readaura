import { db } from "@/shared/db/db";

export async function saveProgress(bookId: string, cfi: string) {
  await db.readingProgress.put({
    bookId,
    cfi,
    updatedAt: new Date().toISOString(),
  });
}

export async function getProgress(bookId: string) {
  return db.readingProgress.get(bookId);
}
