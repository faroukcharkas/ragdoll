"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createDocument, createDocumentAndRedirect } from "@/actions/documents";
import { useState } from "react";
import { use } from "react";
import { DashboardHeader } from "@/components/dashboard/header/header";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectGroup,
} from "@/components/ui/select";

const formSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  url: z.string().min(1),
  description: z.string().min(1),
  splitType: z.enum(["SENTENCE", "SEMANTIC"]),
});

function NewDocumentFormHeader() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold font-display">New Document</h1>
      <p className="text-sm text-muted-foreground">Create a new document</p>
    </div>
  );
}

function NewDocumentFormFields({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

function NewDocumentForm({ projectId }: { projectId: number }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      body: "",
      url: "",
      description: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await createDocumentAndRedirect({
        title: data.title,
        body: data.body,
        url: data.url,
        description: data.description,
        projectId,
        splitType: data.splitType,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-2xl w-full flex flex-col gap-10"
      >
        <NewDocumentFormHeader />
        <NewDocumentFormFields>
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
                  This will be used as the title of the document.
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
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input placeholder="URL" {...field} />
                </FormControl>
                <FormDescription>
                  This will be used as the URL of the document.
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Description" {...field} />
                </FormControl>
                <FormDescription>
                  This will be used as the description of the document.
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
                  <Select {...field}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a split type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="SENTENCE">Sentence</SelectItem>
                        <SelectItem value="SEMANTIC">Semantic</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  This will be used to split the document into chunks.
                </FormDescription>
              </FormItem>
            )}
          />
        </NewDocumentFormFields>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create"}
        </Button>
      </form>
    </Form>
  );
}

export default function NewDocumentPage({
  params,
}: {
  params: Promise<{ projectId: number }>;
}) {
  const { projectId } = use(params);

  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: "Projects", href: "/dashboard/projects" },
          {
            label: "Documents",
            href: `/dashboard/projects/${projectId}/documents`,
          },
          {
            label: "New Document",
            href: `/dashboard/projects/${projectId}/documents/new`,
          },
        ]}
      />
      <div className="flex gap-4 justify-center">
        <NewDocumentForm projectId={projectId} />
      </div>
    </>
  );
}
