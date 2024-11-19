import { Card } from "@/components/ui/card";
import { SignUpForm } from "./parts/form";
import Link from "next/link";
import { redirectToDashboardIfSignedIn } from "@/actions/auth";

export default async function SignUpPage() {
  await redirectToDashboardIfSignedIn();

  return (
    <div className="flex flex-col gap-4 max-w-sm w-full">
      <Card className="w-full p-4">
        <SignUpForm />
      </Card>
      <Link href="/login" className="text-sm text-center">
        Already have an account? Log in
      </Link>
    </div>
  );
}
