"use client";

import { useEffect, useState } from "react";
import { addBook, getAllBooks } from "@/entities/book/book.service";
import Link from "next/link";

interface Book {
  id: string;
  title: string;
}

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);

  async function loadBooks() {
    const data = await getAllBooks();
    setBooks(data);
  }

  useEffect(() => {
    loadBooks();
  }, []);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.name.endsWith(".epub")) {
      alert("Only EPUB files supported");
      return;
    }

    await addBook(file);

    await loadBooks();
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>ReadAura Library</h1>

      <div style={{ marginTop: 20 }}>
        <input type="file" accept=".epub" onChange={handleUpload} />
      </div>

      <div style={{ marginTop: 40 }}>
        {books.length === 0 && <p>No books yet</p>}

        {books.map((book) => (
          <div key={book.id} style={{ marginBottom: 10 }}>
            <Link href={`/reader/${book.id}`}>{book.title}</Link>
          </div>
        ))}
      </div>
    </main>
  );
}
