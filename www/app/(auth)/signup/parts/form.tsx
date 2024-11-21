"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { signup } from "@/actions/auth";
import { toast } from "@/hooks/use-toast";
import { authFormInputSchema } from "@/schema/auth";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!authFormInputSchema.safeParse({ email, password }).success) {
      toast({
        title: "Invalid email or password",
        description:
          "Password must be at least 8 characters long and email must be a valid email address",
      });
      return;
    } else if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please try again",
      });
      return;
    } else {
      try {
        await signup({ email, password });
      } catch (error) {
        if (error instanceof Error) {
          toast({ title: "Error", description: error.message });
        } else {
          toast({ title: "Error", description: "Something went wrong" });
        }
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-xl font-semibold font-display text-center">Sign Up</p>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button type="submit">Sign Up</Button>
    </form>
  );
}
