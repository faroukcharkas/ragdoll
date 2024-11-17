import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
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
