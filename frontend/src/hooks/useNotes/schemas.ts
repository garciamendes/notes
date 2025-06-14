import { z } from "zod";

export const noteSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});
export type Note = z.infer<typeof noteSchema>;

export const paginationNoteSchema = z.object({
  total: z.number(),
  page: z.number(),
  total_page: z.number(),
  notes: z.array(noteSchema.omit({ content: true })),
});

export type PaginationNotes = z.infer<typeof paginationNoteSchema>;

export const filtersNotesSchema = z.object({
  search: z.string().optional(),
});
export type FiltersNotes = z.infer<typeof filtersNotesSchema>;

export const NotePropsSchema = noteSchema.pick({ id: true });
export type NoteProps = z.infer<typeof NotePropsSchema>;
