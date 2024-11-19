import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirectToDashboardIfSignedIn } from "@/actions/auth";

export default async function Home() {
  await redirectToDashboardIfSignedIn();

  return (
    <div>
      <p>Landing Page</p>
      <Link href="/login">
        <Button>Log In</Button>
      </Link>
      <Link href="/signup">
        <Button>Sign Up</Button>
      </Link>
    </div>
  );
}
