import { Card } from "@/components/ui/card";
import { SignUpForm } from "./parts/form";
import Link from "next/link";

export default function SignUpPage() {
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
