"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
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

const textInputField = z.object({
  value: z.string(),
});

const formSchema = z.object({
  body: z.string().min(1),
  metadataSchemaId: z.string(),
  textInputFields: z.array(textInputField),
});

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
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "textInputFields",
  });
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await createDocumentAndRedirect({
        body: data.body,
        projectId,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    remove();
    const schema = metadataSchemas.find(
      (schema) => schema.id === Number(form.watch("metadataSchemaId"))
    );
    console.log("Schemaaaa");
    console.log(schema?.schema);
  }, [form.watch("metadataSchemaId"), metadataSchemas]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-2xl w-full flex flex-col gap-10"
      >
        <FormHeader>
          <FormTitle>New Document</FormTitle>
          <FormSubtitle>Create a new document</FormSubtitle>
        </FormHeader>
        <FormFields>
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
              <Fragment key={field.id}>
                <FormField
                  control={form.control}
                  name={`textInputFields.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{field.name}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={field.name}
                          value={field.value}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </Fragment>
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
