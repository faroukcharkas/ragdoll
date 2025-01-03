"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DialogTitle,
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
} from "@/components/ui/form";
import { updateProjectName } from "@/actions/projects";

const projectNameSchema = z.object({
  name: z.string().min(1),
});

export function ProjectTitle({
  projectId,
  projectName,
}: {
  projectId: string;
  projectName: string;
}) {
  const form = useForm<z.infer<typeof projectNameSchema>>({
    resolver: zodResolver(projectNameSchema),
    defaultValues: {
      name: projectName,
    },
  });
  const [displayedName, setDisplayedName] = useState(projectName);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onSubmit = async (data: z.infer<typeof projectNameSchema>) => {
    setIsLoading(true);
    await updateProjectName(projectId, data.name);
    setDisplayedName(data.name);
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-row gap-2 justify-start items-center">
      <h1 className="text-3xl font-bold font-display">{displayedName}</h1>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Pencil className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project Name</DialogTitle>
            <DialogDescription>
              Change the name of your project
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          form.getValues("name").length > 0
                            ? form.getValues("name")
                            : "Project Name"
                        }
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button disabled={isLoading} type="submit">
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
