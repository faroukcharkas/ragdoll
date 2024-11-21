"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createDocument, createDocumentAndRedirect } from "@/actions/documents";
import { useState } from "react";
import { use } from "react";
import { DashboardHeader } from "@/components/dashboard/header/header";
import { Textarea } from "@/components/ui/textarea";

export default function NewDocumentPage({
  params,
}: {
  params: Promise<{ projectId: number }>;
}) {
  const { projectId } = use(params);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await createDocumentAndRedirect({
        title,
        body,
        url,
        description,
        projectId,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <DashboardHeader
        breadcrumbs={[
          { label: "Projects", href: "/dashboard/projects" },
          {
            label: "Documents",
            href: `/dashboard/projects/${projectId}/documents`,
          },
          { label: "New", href: "" },
        ]}
      />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold font-display">New Document</h1>
          <p className="text-sm text-muted-foreground">
            Create a new document for Project {projectId}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium font-display">Title</label>
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            This will be used as the title of the document.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium font-display">Body</label>
          <Textarea
            placeholder="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            This piece of text is what will be chunked and embedded.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium font-display">URL</label>
          <Input
            type="text"
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Citations will use this URL.
          </p>
        </div>
        <div className="flex flex-col gap-2 mb-6">
          <label className="text-sm font-medium font-display">
            Description
          </label>
          <Input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            This will give the AI context about the chunk.
          </p>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create"}
        </Button>
      </form>
    </>
  );
}
