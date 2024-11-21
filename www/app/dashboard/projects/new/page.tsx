"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createProject } from "@/actions/projects";
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { DashboardHeader } from "@/components/dashboard/header/header";

export default function NewProjectPage() {
  const [name, setName] = useState("");
  const [pineconeApiKey, setPineconeApiKey] = useState("");
  const [pineconeIndexName, setPineconeIndexName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await createProject({ name, pineconeApiKey, pineconeIndexName });
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
          { label: "New", href: "" },
        ]}
      />
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">New Project</h1>
            <p className="text-sm text-muted-foreground">
              Create a new project to get started.
            </p>
          </div>
          <Input
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Pinecone API Key"
            value={pineconeApiKey}
            onChange={(e) => setPineconeApiKey(e.target.value)}
          />
          <Input
            placeholder="Pinecone Index Name"
            value={pineconeIndexName}
            onChange={(e) => setPineconeIndexName(e.target.value)}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </>
  );
}
