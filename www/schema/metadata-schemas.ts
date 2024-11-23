import { z } from "zod";

export const metadataSchemaFieldSchema = z.object({
  key: z.string(),
  value: z.enum(["TEXT_INPUT", "ORDER_IN_DOCUMENT"]),
});

export type MetadataSchemaField = z.infer<typeof metadataSchemaFieldSchema>;

export const metadataSchemaSchema = z.object({
  id: z.number(),
  name: z.string(),
  schema: z.any(),
});

export type MetadataSchema = z.infer<typeof metadataSchemaSchema>;
