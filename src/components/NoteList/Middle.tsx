import { useEffect, useState, useRef, useCallback } from "react";
import { api } from "../../api/axios";
import type { Note, NotesResponse } from "../../types/api";
import Card from "./Card";
import { useNavigate, useParams } from "react-router-dom";

import NotesList from "./NotesList";
import useFolder from "@/hooks/useFolder";
import { useSearchParams } from "react-router-dom";
import { useNotes } from "@/hooks/useNotes";

// fetchingnote from selected folder fromleft
export default function Middle({
  isFavoritesPage = false,
  isArchivedPage = false,
  isTrashPage = false,
}) {
  const requestIdRef = useRef(0);
  const { folderId, noteId } = useParams();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [notes, setNotes] = useState<Note[]>([]);
  const { refreshTrigger } = useNotes();
  const loaderRef = useRef<HTMLDivElement | null>(null);
  // const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [searchResults, setSearchResults] = useState<Note[]>([]);
  const loadNotes = useCallback(
    async (pageNumber = 1) => {
      const requestId = requestIdRef.current;
      try {
        setLoading(true);
        if (isTrashPage) {
          const res1 = await api.get<NotesResponse>(
            `/notes?page=${pageNumber}&limit=10&deleted=true&archived=true`,
          );

          const res2 = await api.get<NotesResponse>(
            `/notes?page=${pageNumber}&limit=10&deleted=true&archived=false`,
          );

          const noteData = [...res1.data.notes, ...res2.data.notes];

          if (requestId !== requestIdRef.current) return;

          if (pageNumber === 1) {
            setNotes(noteData);
          } else {
            setNotes((prev) => [...prev, ...noteData]);
          }

          if (noteData.length < 10) setHasMore(false);
          return;
        }

        let url = `/notes?page=${pageNumber}&limit=10`;

        if (folderId) {
          url += `&folderId=${folderId}`;
        }
        if (isFavoritesPage) {
          url += `&favorite=true&deleted=false&archived=false`;
        }

        if (isArchivedPage) {
          url += `&archived=true&deleted=false`;
        }

        // if (isTrashPage) {
        //   url += `&deleted=true`;
        // }

        const response = await api.get<NotesResponse>(url);
        if (requestId !== requestIdRef.current) return;
        const noteData = response.data.notes;
        if (pageNumber === 1) {
          setNotes(noteData);
        } else {
          setNotes((prev) => [...prev, ...noteData]);
        }
        if (noteData.length < 10) {
          setHasMore(false);
        }
      } catch (error) {
        console.log("Error in loading notes", error);
      } finally {
        setLoading(false);
      }
    },
    [folderId, isFavoritesPage, isArchivedPage, isTrashPage],
  );

  // useEffect(() => {
  //   if (noteId) {
  //     setSelectedNoteId(noteId);
  //   }
  // }, [noteId]);

  // fetching notes when folder chnages
  useEffect(() => {
    setHasMore(true);
    setNotes([]);
    requestIdRef.current++;
    loadNotes(1);
  }, [folderId, isFavoritesPage, isArchivedPage, isTrashPage, refreshTrigger]);

  // scrolling
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const first = entries[0];

      if (first.isIntersecting && hasMore && !loading) {
        loadNotes(notes.length / 10 + 1);
      }
    });

    const current = loaderRef.current;

    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasMore, loading]);

  // to show folderName as heading in middleportion
  const { folders } = useFolder();
  let folderName = "";
  if (isArchivedPage) folderName = "Archived Notes";
  else if (isFavoritesPage) folderName = "Favorites";
  else if (isTrashPage) folderName = "Trash";
  else if (folderId) {
    const selected = folders.find((f) => f.id === folderId);
    folderName = selected?.name || "";
  }

  // search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!query.trim()) return;

      async function searchNotes() {
        try {
          const response = await api.get<NotesResponse>(
            `/notes?search=${query}&limit=50`,
          );
          setSearchResults(response.data.notes);
        } catch (error) {
          console.log("Search error:", error);
        }
      }

      searchNotes();
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);
  if (query.trim() !== "") {
    return (
      <div className="h-screen flex flex-col w-middle p-4 border-r border-(--color-border) overflow-y-auto no-scrollbar font-name bg-(--color-middle-back)">
        <h2 className="text-2xl font-semibold text-(--color-text)">
          Search Results
        </h2>

        {searchResults.length === 0 && (
          <div className="text-gray-400 pt-4">No results found</div>
        )}

        {searchResults.map((note) => (
          <div
            key={note.id}
            className="pt-4 cursor-pointer"
            onClick={() => navigate(`/folder/${note.folderId}/note/${note.id}`)}
          >
            <Card note={note} isActive={false} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="h-full w-middle p-4 border-r border-(--color-border) flex flex-col gap-5 font-name bg-(--color-middle-back) text-(--color-text) overflow-y-auto no-scrollbar">
      <h2 className="text-2xl font-semibold">{folderName}</h2>
      {/* notes List */}
      {notes.length === 0 && !loading ? (
        <div className="text-sm pt-2 text-center text-gray-500">
          No Notes found
        </div>
      ) : (
        <NotesList
          notes={notes}
          isTrashPage={isTrashPage}
          isFavoritesPage={isFavoritesPage}
          isArchivedPage={isArchivedPage}
          selectedNoteId={noteId ?? null}
          // setSelectedNoteId={setSelectedNoteId}
        />
      )}

      <div ref={loaderRef} className="flex justify-center py-4">
        {loading && (
          <div className="text-gray-400 text-sm">Loading notes...</div>
        )}
      </div>
    </div>
  );
}
