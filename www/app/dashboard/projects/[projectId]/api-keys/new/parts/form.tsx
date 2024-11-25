"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1),
});

function NewApiKeyFormHeader() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold font-display">New API Key</h1>
      <p className="text-sm text-muted-foreground">Create a new API key</p>
    </div>
  );
}

function NewApiKeyFormFields({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

export default function NewApiKeyForm({ projectId }: { projectId: number }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-2xl w-full flex flex-col gap-10"
      >
        <NewApiKeyFormHeader />
        <NewApiKeyFormFields>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="My API Key" {...field} />
                </FormControl>
                <FormDescription>
                  This will be used as the name of the API key.
                </FormDescription>
              </FormItem>
            )}
          />
        </NewApiKeyFormFields>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create"}
        </Button>
      </form>
    </Form>
  );
}
