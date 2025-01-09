"use client";

import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { login } from "@/actions/auth";
import { toast } from "@/hooks/use-toast";
import { authFormInputSchema } from "@/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import CustomButton from "@/components/custom/button";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function LoginFormFields({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSubmit(data: z.infer<typeof formSchema>) {
    if (!authFormInputSchema.safeParse(data).success) {
      toast({
        title: "Invalid email or password",
        description:
          "Password must be at least 8 characters long and email must be a valid email address",
      });
      return;
    } else {
      try {
        await login(data);
      } catch (error) {
        if (error instanceof Error && error.message === "NEXT_REDIRECT") {
          // dirtttyy code
          return;
        }
        if (error instanceof Error) {
          toast({ title: "Error", description: error.message });
        } else {
          toast({ title: "Error", description: "Something went wrong" });
        }
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <p className="text-xl font-semibold font-display text-center">Log In</p>
        <LoginFormFields>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </LoginFormFields>
        <LoginFormFields>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </LoginFormFields>
        <CustomButton
          type="submit"
          disabled={form.formState.isSubmitting}
          label="Log In"
        />
      </form>
    </Form>
  );
}
