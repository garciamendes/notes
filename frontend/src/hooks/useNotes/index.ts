import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import api from "../../infra/api";
import type { FiltersNotes, Note, NoteProps, PaginationNotes } from "./schemas";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export const useNotes = ({ id }: NoteProps) => {
  const getNote = useQuery({
    queryKey: [id],
    queryFn: async () => {
      try {
        if (!id) return null;

        const result = await api.get<Note>(`/api/notes/${id}`);

        return result.data;
      } catch (error) {
        const err = error as AxiosError;
        const message = (err.response?.data as string) || err.message;

        toast.error(message);
      }
    },
  });

  return {
    getNote,
  };
};

export const useListNotes = ({ search }: FiltersNotes) => {
  return useInfiniteQuery({
    initialPageParam: 1,
    queryKey: ["list_notes", search],
    queryFn: async ({ pageParam }) => {
      const result = await api.get<PaginationNotes>("/api/notes", {
        params: {
          page: pageParam,
          search,
        },
      });

      return result.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_page) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
};
