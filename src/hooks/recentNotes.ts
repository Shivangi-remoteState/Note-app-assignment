import { useEffect, useState } from "react";
import { api } from "@/api/axios";
import type { RecentNote, RecentNotesResponse } from "@/types/api";

const useRecentNotes = () => {
  const [recentNotes, setRecentNotes] = useState<RecentNote[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRecentNotes = async () => {
    try {
      setLoading(true);
      const response = await api.get<RecentNotesResponse>("/notes/recent");
      setRecentNotes(response.data.recentNotes || []);
    } catch (error) {
      console.log("Error fetching recent notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecentNotes();
  }, []);

  return { recentNotes, loading, loadRecentNotes };
};

export default useRecentNotes;
