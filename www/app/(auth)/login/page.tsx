import { Card } from "@/components/ui/card";
import { LoginForm } from "./parts/form";
import Link from "next/link";
import { redirectToDashboardIfSignedIn } from "@/actions/auth";
export default async function LoginPage() {
  await redirectToDashboardIfSignedIn();

  return (
    <div className="flex flex-col gap-4 max-w-sm w-full">
      <Card className="w-full p-4">
        <LoginForm />
      </Card>
      <Link href="/signup" className="text-sm text-center">
        No account? Sign up
      </Link>
    </div>
  );
}
