"use client";

import { Plus, Trash } from "lucide-react";
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
} from "@/components/ui/table";
import { MetadataSchemaField } from "@/schema/metadata-schemas";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function NewMetadataSchemaHeader() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold font-display">New Metadata Schema</h1>
      <p className="text-sm text-muted-foreground">
        Create a new metadata schema
      </p>
    </div>
  );
}

function NewMetadataSchemaFields({
  fields,
  removeField,
  onFieldKeyChange: onKeyChange,
  onFieldValueChange: onValueChange,
}: {
  fields: MetadataSchemaField[];
  removeField: (index: number) => void;
  onFieldKeyChange: (index: number, key: string) => void;
  onFieldValueChange: (
    index: number,
    value: MetadataSchemaField["value"]
  ) => void;
}) {
  return fields.map((field, index) => (
    <TableRow key={index}>
      <TableCell>
        <Input
          value={field.key}
          onChange={(e) => onKeyChange(index, e.target.value)}
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
            <SelectItem value="TEXT_INPUT">Text Input</SelectItem>
            <SelectItem value="ORDER_IN_DOCUMENT">Order in Document</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Button variant="outline" onClick={() => removeField(index)}>
          <Trash className="w-4 h-4" />
        </Button>
      </TableCell>
    </TableRow>
  ));
}

export default function NewMetadataSchemaForm() {
  const [fields, setFields] = useState<MetadataSchemaField[]>([]);
  const [name, setName] = useState("");

  function removeField(index: number) {
    setFields(fields.filter((_, i) => i !== index));
  }

  function onValueChange(index: number, value: MetadataSchemaField["value"]) {
    setFields(
      fields.map((field, i) => (i === index ? { ...field, value } : field))
    );
  }

  function onKeyChange(index: number, key: string) {
    setFields(
      fields.map((field, i) => (i === index ? { ...field, key } : field))
    );
  }

  return (
    <>
      <NewMetadataSchemaHeader />
      <div className="flex flex-col gap-2">
        <Label>Schema Name</Label>
        <Input
          placeholder="e.g. Lecture Document"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <Table>
        <TableCaption>
          <Button
            variant="outline"
            onClick={() =>
              setFields([...fields, { key: "New Field", value: "TEXT_INPUT" }])
            }
          >
            <Plus className="w-4 h-4" />
            Add Field
          </Button>
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Key</TableHead>
            <TableHead>Value</TableHead>
            <TableHead></TableHead>
          </TableRow>
          <NewMetadataSchemaFields
            fields={fields}
            removeField={removeField}
            onFieldKeyChange={onKeyChange}
            onFieldValueChange={onValueChange}
          />
        </TableHeader>
      </Table>
      <Button>Create Schema</Button>
    </>
  );
}
