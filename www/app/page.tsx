import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirectToDashboardIfSignedIn } from "@/actions/auth";
import Logo from "@/public/logo.svg";
import Image from "next/image";
export default async function Home() {
  await redirectToDashboardIfSignedIn();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="max-w-xl flex flex-col gap-4 justify-center items-center">
        <Image src={Logo} alt="Ragdoll" width={200} height={200} />
        <h1 className="text-5xl font-bold font-display">Ragdoll</h1>
        <p className="text-sm text-muted-foreground font-sans text-center">
          What if playing with RAG was as easy as playing with a doll?
        </p>
        <p className="text-sm text-muted-foreground font-sans text-center font-semibold">
          This is being developed and maintained by farouk.charkas@gmail.com and
          is currently in public beta.
        </p>
        <div className="flex gap-4">
          <Link href="/login">
            <Button>Log In</Button>
          </Link>
          <Link href="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
