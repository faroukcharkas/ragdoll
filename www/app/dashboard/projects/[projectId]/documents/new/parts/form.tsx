"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  FormHeader,
  FormTitle,
  FormSubtitle,
  FormFields,
} from "@/components/form";
import { Button } from "@/components/ui/button";
import { createDocumentAndRedirect } from "@/actions/documents";
import { Fragment, useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { MetadataSchema, MetadataSchemaField } from "@/schema/metadata-schemas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { documentSplitTypeSchema } from "@/schema/documents";
import { Brain, MessageSquare, Text } from "lucide-react";

const textInputField = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

const formSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  metadataSchemaId: z.string(),
  customTextMetadataFields: z.array(textInputField),
  splitType: documentSplitTypeSchema,
});

function MetadataSchemaCustomTextField({
  field,
  selectedMetadataSchemaFields,
  index,
  form,
}: {
  field: any;
  selectedMetadataSchemaFields: MetadataSchemaField[];
  index: number;
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) {
  return (
    <FormField
      key={field.id}
      control={form.control}
      name={`customTextMetadataFields.${index}.value`}
      render={({ field }) => {
        console.log(field);
        return (
          <FormItem className="flex gap-2 items-center">
            <FormLabel className="mt-2 font-mono flex gap-2">
              <Text className="w-4 h-4" />
              {selectedMetadataSchemaFields[index].name}
            </FormLabel>
            <div className="max-w-12 w-full">
              <Separator
                className="w-full border-dashed"
                orientation="horizontal"
              />
            </div>
            <FormControl>
              <Input
                {...field}
                placeholder={selectedMetadataSchemaFields[index].name}
                value={field.value}
              />
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
}

export default function NewDocumentForm({
  projectId,
  metadataSchemas,
}: {
  projectId: number;
  metadataSchemas: MetadataSchema[];
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      body: "",
      title: "",
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "customTextMetadataFields",
  });
  const [selectedSchemaFields, setSelectedSchemaFields] = useState<
    MetadataSchemaField[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    await createDocumentAndRedirect({
      body: data.body,
      projectId,
      splitType: data.splitType,
      title: data.title,
      text_payload: data.customTextMetadataFields.reduce((acc, field) => {
        acc[field.name] = field.value;
        return acc;
      }, {} as Record<string, string>),
      metadata_schema_id: Number(data.metadataSchemaId),
    });
    setIsLoading(false);
  }

  useEffect(() => {
    remove();
    const selectedMetadataSchema = metadataSchemas.find(
      (schema) => schema.id === Number(form.watch("metadataSchemaId"))
    );
    const customTextFields = selectedMetadataSchema?.fields.filter(
      (field) => field.value === "CUSTOM_TEXT"
    );
    customTextFields?.forEach((field) =>
      append({ name: field.name, value: "" })
    );
    setSelectedSchemaFields(customTextFields || []);
  }, [form.watch("metadataSchemaId"), metadataSchemas]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-2xl w-full flex flex-col gap-10 pb-24"
      >
        <FormHeader>
          <FormTitle>New Document</FormTitle>
          <FormSubtitle>Create a new document</FormSubtitle>
        </FormHeader>
        <FormFields>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormDescription>
                  This is title will not be included in document chunks. If you
                  want it to, create a field in the metadata schema.
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Body</FormLabel>
                <FormControl>
                  <Textarea placeholder="Body" {...field} />
                </FormControl>
                <FormDescription>
                  This will be used as the body of the document.
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="splitType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Split Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a split type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SEMANTIC">
                        <div className="flex items-center gap-2">
                          <Brain className="w-4 h-4" />
                          Semantic
                        </div>
                      </SelectItem>
                      <SelectItem value="SENTENCE">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Sentence
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  This is the type of split to use when generating chunks of
                  this document.
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="metadataSchemaId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Metadata Schema</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a metadata schema" />
                    </SelectTrigger>
                    <SelectContent>
                      {metadataSchemas.map((schema) => (
                        <SelectItem
                          key={schema.id}
                          value={schema.id.toString()}
                        >
                          {schema.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  This schema will be used to generate chunks of this document.
                </FormDescription>
              </FormItem>
            )}
          />
          {fields.length !== 0 && <Separator />}
          {fields.map((field, index) => {
            return (
              <MetadataSchemaCustomTextField
                key={field.id}
                field={field}
                selectedMetadataSchemaFields={selectedSchemaFields}
                index={index}
                form={form}
              />
            );
          })}
        </FormFields>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create"}
        </Button>
      </form>
    </Form>
  );
}
