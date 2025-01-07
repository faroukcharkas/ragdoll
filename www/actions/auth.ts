'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { User, userSchema } from '@/types/user';

export type AuthInput = {
  email: string;
  password: string;
};

export async function login({ email, password }: AuthInput) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup({ email, password, firstName, lastName }: AuthInput & { firstName: string; lastName: string }) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    throw new Error(error.message);
  }

  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    throw new Error("User not found");
  }

  const { error: insertError } = await supabase.from("user").insert({
    id: user.user?.id,
    first_name: firstName,
    last_name: lastName,
  });

  revalidatePath("/", "layout");
  redirect("/dashboard");
}


export async function redirectToDashboardIfSignedIn() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }
}

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
}

export async function getUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: userData } = await supabase.from("user").select("*").eq("id", user.id).single();

  if (!userData) {
    return null;
  }

  return userSchema.parse({
    id: user.id,
    email: user.email,
    firstName: userData.first_name,
    lastName: userData.last_name,
  });
}
