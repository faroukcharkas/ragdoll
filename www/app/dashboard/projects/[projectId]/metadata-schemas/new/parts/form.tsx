"use client";

import {
  ArrowDown01,
  ArrowRight,
  ArrowLeft,
  Plus,
  Text,
  Trash,
  CircleChevronLeft,
  CircleChevronRight,
  Circle,
  ArrowUpDown,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableCaption,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import {
  MetadataSchemaField,
  metadataSchemaFieldSchema,
} from "@/schema/metadata-schemas";
import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { createMetadataSchemaAndRedirect } from "@/actions/metadata-schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useFieldArray,
  UseFieldArrayRemove,
  UseFieldArrayAppend,
  useForm,
} from "react-hook-form";
import {
  FormFields,
  FormHeader,
  FormSubtitle,
  FormTitle,
} from "@/components/form";

function MetadataSchemaFieldRow({
  field,
  index,
  onNameChange,
  onValueChange,
  removeField,
}: {
  field: MetadataSchemaField;
  index: number;
  removeField: (index: number) => void;
  onNameChange: (index: number, name: string) => void;
  onValueChange: (index: number, value: MetadataSchemaField["value"]) => void;
}) {
  return (
    <TableRow>
      <TableCell>
        <Input
          value={field.name}
          placeholder="e.g. My Field"
          onChange={(e) => onNameChange(index, e.target.value)}
        />
      </TableCell>
      <TableCell>
        <Select
          value={field.value}
          onValueChange={(value) =>
            onValueChange(index, value as MetadataSchemaField["value"])
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a value" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CUSTOM_TEXT">
              <div className="flex items-center gap-2">
                <Text className="w-4 h-4" />
                Custom Text
              </div>
            </SelectItem>
            <SelectItem value="ORDER_IN_DOCUMENT">
              <div className="flex items-center gap-2">
                <ArrowDown01 className="w-4 h-4" />
                Order in Document
              </div>
            </SelectItem>
            <SelectItem value="PREVIOUS_CHUNK_TEXT">
              <div className="flex items-center gap-2">
                <CircleChevronLeft className="w-4 h-4" />
                Previous Chunk
              </div>
            </SelectItem>
            <SelectItem value="NEXT_CHUNK_TEXT">
              <div className="flex items-center gap-2">
                <CircleChevronRight className="w-4 h-4" />
                Next Chunk
              </div>
            </SelectItem>
            <SelectItem value="CURRENT_CHUNK_TEXT">
              <div className="flex items-center gap-2">
                <Text className="w-4 h-4" />
                This Chunk
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Button
          variant="outline"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            removeField(index);
          }}
        >
          <Trash className="w-4 h-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

function MetadataSchemaFieldRows({
  fields,
  appendField,
  removeField,
  onNameChange,
  onValueChange,
}: {
  fields: MetadataSchemaField[];
  appendField: UseFieldArrayAppend<
    { name: string; fields: MetadataSchemaField[] },
    "fields"
  >;
  removeField: UseFieldArrayRemove;
  onNameChange: (index: number, name: string) => void;
  onValueChange: (index: number, value: MetadataSchemaField["value"]) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Value</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fields.map((field, index) => (
          <MetadataSchemaFieldRow
            key={index}
            field={field}
            index={index}
            onNameChange={onNameChange}
            onValueChange={onValueChange}
            removeField={removeField}
          />
        ))}
      </TableBody>
      <TableCaption>
        <Button
          variant="outline"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            appendField({ name: "", value: "CUSTOM_TEXT" });
          }}
        >
          <Plus className="w-4 h-4" />
          Add Field
        </Button>
      </TableCaption>
    </Table>
  );
}

const formSchema = z.object({
  name: z.string().min(1),
  fields: z.array(metadataSchemaFieldSchema).min(1),
});

export default function NewMetadataSchemaForm({
  projectId,
}: {
  projectId: string;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      fields: [],
    },
  });
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "fields",
  });
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
    setIsLoading(true);
    try {
      await createMetadataSchemaAndRedirect(
        parseInt(projectId),
        data.fields,
        data.name
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function onNameChange(index: number, name: string) {
    update(index, { name, value: fields[index].value });
  }

  async function onValueChange(
    index: number,
    value: MetadataSchemaField["value"]
  ) {
    update(index, { name: fields[index].name, value });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-2xl w-full flex flex-col gap-10"
      >
        <FormHeader>
          <FormTitle>New Metadata Schema</FormTitle>
          <FormSubtitle>Create a new metadata schema</FormSubtitle>
        </FormHeader>
        <FormFields>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Schema Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Lecture Document" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fields"
            render={() => (
              <FormItem>
                <FormLabel>Fields</FormLabel>
                <MetadataSchemaFieldRows
                  fields={fields}
                  appendField={append}
                  removeField={remove}
                  onNameChange={onNameChange}
                  onValueChange={onValueChange}
                />
              </FormItem>
            )}
          />
        </FormFields>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Schema"}
        </Button>
      </form>
    </Form>
  );
}
