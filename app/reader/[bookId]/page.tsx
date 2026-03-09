"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import ePub from "epubjs";
import { getBookById } from "@/entities/book/book.service";
import {
  saveProgress,
  getProgress,
} from "@/entities/reading-progress/progress.service";

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

      await book.ready;

      const progress = await getProgress(bookId);

      if (progress?.cfi) {
        rendition.display(progress.cfi);
      } else {
        rendition.display();
      }

      rendition.on("relocated", (location: any) => {
        const cfi = location.start.cfi;
        saveProgress(bookId, cfi);
      });
    }

    loadBook();
  }, [bookId]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!renditionRef.current) return;

      if (e.key === "ArrowRight") renditionRef.current.next();
      if (e.key === "ArrowLeft") renditionRef.current.prev();
    }

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  function handleClick(e: React.MouseEvent) {
    if (!renditionRef.current) return;

    const width = window.innerWidth;

    if (e.clientX > width / 2) renditionRef.current.next();
    else renditionRef.current.prev();
  }

  return (
    <main
      onClick={handleClick}
      style={{
        height: "100vh",
        width: "100%",
        background: "#f5f3ef",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        ref={viewerRef}
        style={{
          height: "100%",
          width: "100%",
          maxWidth: "720px",
          padding: "40px",
        }}
      />
    </main>
  );
}
