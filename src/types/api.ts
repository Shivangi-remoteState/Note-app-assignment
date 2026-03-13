export interface Folder {
  id: string;
  name: string;
  createdAt: string;
  updateAt: string;
  deletedAt?: string | null;
}
export interface Note {
  id: string;
  folderId: string;
  title: string;
  content: string;
  preview: string;
  deleted: boolean;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  folder: Folder;
}
export interface NotesResponse {
  notes: Note[];
}

export interface NoteResponse {
  note: Note;
}

export interface FoldersResponse {
  folders: Folder[];
}
export type RecentNote = Pick<
  Note,
  "id" | "title" | "preview" | "createdAt" | "folderId"
>;
export interface RecentNotesResponse {
  recentNotes: RecentNote[];
}
