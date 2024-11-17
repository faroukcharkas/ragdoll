"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createDocument } from "@/actions/documents";
import { useState } from "react";
import { use } from "react";

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
      await createDocument({ title, body, url, description, projectId });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">New Document</h1>
      <p className="text-sm text-muted-foreground">
        Create a new document for Project {projectId}
      </p>
      <Input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <Input
        type="text"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create"}
      </Button>
    </form>
  );
}
