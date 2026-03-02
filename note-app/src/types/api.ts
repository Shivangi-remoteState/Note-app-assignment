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

export type RecentNote = {
  id: string;
  title: string;
  preview: string;
  createdAt: string;
  folderId: string;
};
