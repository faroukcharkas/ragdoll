import { z } from "zod";

export const metadataSchemaFieldSchema = z.object({
  name: z.string().min(1),
  value: z.enum([
    "CUSTOM_TEXT",
    "ORDER_IN_DOCUMENT",
    "PREVIOUS_CHUNK_TEXT",
    "NEXT_CHUNK_TEXT",
    "CURRENT_CHUNK_TEXT",
  ]),
});

export type MetadataSchemaField = z.infer<typeof metadataSchemaFieldSchema>;

export const metadataSchemaSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  fields: z.array(metadataSchemaFieldSchema).min(1),
});

export type MetadataSchema = z.infer<typeof metadataSchemaSchema>;
