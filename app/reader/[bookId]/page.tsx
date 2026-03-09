"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import ePub from "epubjs";
import { getBookById } from "@/entities/book/book.service";

export default function ReaderPage() {
  const params = useParams();
  const bookId = params.bookId as string;

  const viewerRef = useRef<HTMLDivElement>(null);
  const renditionRef = useRef<any>(null);

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

      renditionRef.current = rendition;

      rendition.display();
    }

    loadBook();
  }, [bookId]);

  // перелистывание клавиатурой
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!renditionRef.current) return;

      if (e.key === "ArrowRight") {
        renditionRef.current.next();
      }

      if (e.key === "ArrowLeft") {
        renditionRef.current.prev();
      }
    }

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  function handleClick(e: React.MouseEvent) {
    if (!renditionRef.current) return;

    const screenWidth = window.innerWidth;

    if (e.clientX > screenWidth / 2) {
      renditionRef.current.next();
    } else {
      renditionRef.current.prev();
    }
  }

  return (
    <main
      onClick={handleClick}
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
