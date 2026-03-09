"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import ePub from "epubjs";
import { getBookById } from "@/entities/book/book.service";

export default function ReaderPage() {
  const params = useParams();
  const bookId = params.bookId as string;

  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadBook() {
      const bookRecord = await getBookById(bookId);

      if (!bookRecord) return;

      const book = ePub(bookRecord.file);

      const rendition = book.renderTo(viewerRef.current!, {
        width: "100%",
        height: "100%",
        flow: "paginated",
        spread: "none",
      });

      await book.ready;

      const navigation = await book.loaded.navigation;

      // берём первый пункт оглавления
      const firstChapter = navigation.toc[0];

      if (firstChapter?.href) {
        rendition.display(firstChapter.href);
      } else {
        rendition.display();
      }
    }

    loadBook();
  }, [bookId]);

  return (
    <main
      style={{
        height: "100vh",
        width: "100%",
        background: "#111",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        ref={viewerRef}
        style={{
          height: "100%",
          maxWidth: "800px",
          width: "100%",
        }}
      />
    </main>
  );
}
