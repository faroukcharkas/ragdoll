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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { createApiKeyAndReturnKey } from "@/actions/api-keys";

const formSchema = z.object({
  name: z.string().min(1),
});

function NewApiKeyFormDialog({
  isOpen,
  onClose,
  apiKey,
}: {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string | null;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display">API Key Created</DialogTitle>
          <DialogDescription>Below is your new API key.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <p className="text-sm">Key</p>
          <p className="bg-muted p-2 rounded-md w-full font-mono text-sm">
            {apiKey ? apiKey : "ERROR: API KEY NOT FOUND"}
          </p>
          <p className="text-sm text-muted-foreground">
            You will not be able to see this key again.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const key = await createApiKeyAndReturnKey(projectId, data.name);
    setApiKey(key);
    setIsDialogOpen(true);
    setIsLoading(false);
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
      <NewApiKeyFormDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setApiKey(null);
          form.reset();
        }}
        apiKey={apiKey}
      />
    </Form>
  );
}
