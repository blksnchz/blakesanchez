"use client";

import { FormEvent, useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

type Note = {
  id: number;
  title: string;
  content: string;
};

function subscribeToSession(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSessionSnapshot() {
  return sessionStorage.getItem("note-app-session") === "active";
}

function getServerSessionSnapshot() {
  return false;
}

export default function NotesPage() {
  const router = useRouter();
  const hasSession = useSyncExternalStore(
    subscribeToSession,
    getSessionSnapshot,
    getServerSessionSnapshot,
  );
  const [notes, setNotes] = useState<Note[]>(() => {
    if (typeof window === "undefined") return [];

    const savedNotes = localStorage.getItem("memoir-notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!hasSession) router.replace("/");
  }, [hasSession, router]);

  useEffect(() => {
    if (hasSession) localStorage.setItem("memoir-notes", JSON.stringify(notes));
  }, [notes, hasSession]);

  function addNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setNotes((current) => [
      { id: Date.now(), title: title.trim(), content: content.trim() },
      ...current,
    ]);
    setTitle("");
    setContent("");
  }

  function logout() {
    sessionStorage.removeItem("note-app-session");
    router.replace("/");
  }

  if (!hasSession) return null;

  return (
    <main className="notes-shell">
      <header className="notes-header">
        <div className="notes-logo"><span>M</span> Memoir</div>
        <button className="logout-button" onClick={logout} type="button">Logout</button>
      </header>

      <section className="notes-content">
        <div className="notes-heading">
          <div>
            <p className="eyebrow">YOUR NOTEBOOK</p>
            <h1>Notes</h1>
          </div>
          <p>{notes.length} {notes.length === 1 ? "note" : "notes"}</p>
        </div>

        <form className="note-composer" onSubmit={addNote}>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Note title"
            aria-label="Note title"
          />
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write something worth keeping..."
            aria-label="Note content"
          />
          <button type="submit">Add note</button>
        </form>

        <div className="notes-grid">
          {notes.map((note, index) => (
            <article className="note-card" key={note.id}>
              <div className="note-index">{String(index + 1).padStart(2, "0")}</div>
              <h2>{note.title}</h2>
              <p>{note.content}</p>
              <button
                type="button"
                className="delete-button"
                onClick={() => setNotes((current) => current.filter((item) => item.id !== note.id))}
                aria-label={`Delete ${note.title}`}
              >Delete</button>
            </article>
          ))}
        </div>

        {notes.length === 0 && (
          <div className="empty-state">
            <p>Your notebook is ready.</p>
            <span>Add your first note above.</span>
          </div>
        )}
      </section>
    </main>
  );
}
