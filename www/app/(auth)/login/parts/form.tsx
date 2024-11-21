"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { login } from "@/actions/auth";
import { toast } from "@/hooks/use-toast";
import { authFormInputSchema } from "@/schema/auth";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!authFormInputSchema.safeParse({ email, password }).success) {
      toast({
        title: "Invalid email or password",
        description:
          "Password must be at least 8 characters long and email must be a valid email address",
      });
      return;
    } else {
      setIsLoading(true);
      try {
        await login({ email, password });
      } catch (error) {
        setIsLoading(false);
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
      <p className="text-xl font-semibold font-display text-center">Log In</p>
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
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Log In"}
      </Button>
    </form>
  );
}
