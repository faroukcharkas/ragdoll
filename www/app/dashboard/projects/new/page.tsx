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
import { createProject } from "@/actions/projects";
import { useState } from "react";
import { DashboardHeader } from "@/app/dashboard/parts/header";

const formSchema = z.object({
  name: z.string().min(1),
  pineconeApiKey: z.string().min(10),
  pineconeIndexName: z.string().min(2),
});

function NewProjectFormHeader() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold font-display">New Project</h1>
      <p className="text-sm text-muted-foreground">
        Create a new project to get started.
      </p>
    </div>
  );
}

function NewProjectFormFields({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

function NewProjectForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      pineconeApiKey: "",
      pineconeIndexName: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await createProject({
        name: data.name,
        pineconeApiKey: data.pineconeApiKey,
        pineconeIndexName: data.pineconeIndexName,
        redirectToProject: true,
      });
    } catch (error) {
      console.log("error", error);
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
        <NewProjectFormHeader />
        <NewProjectFormFields>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder="Project Name" {...field} />
                </FormControl>
                <FormDescription>
                  This will be used as the name of the project.
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pineconeApiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pinecone API Key</FormLabel>
                <FormControl>
                  <Input placeholder="Pinecone API Key" {...field} />
                </FormControl>
                <FormDescription>
                  This is the API key for your Pinecone account.
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pineconeIndexName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pinecone Index Name</FormLabel>
                <FormControl>
                  <Input placeholder="Pinecone Index Name" {...field} />
                </FormControl>
                <FormDescription>
                  This is the name of the Pinecone index to use for this
                  project.
                </FormDescription>
              </FormItem>
            )}
          />
        </NewProjectFormFields>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create"}
        </Button>
      </form>
    </Form>
  );
}

export default function NewProjectPage() {
  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: "Projects", href: "/dashboard/projects" },
          { label: "New Project", href: "/dashboard/projects/new" },
        ]}
      />
      <div className="flex gap-4 justify-center">
        <NewProjectForm />
      </div>
    </>
  );
}
