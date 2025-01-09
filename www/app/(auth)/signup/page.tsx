import { SignUpForm } from "./parts/form";
import Link from "next/link";
import { redirectToDashboardIfSignedIn } from "@/actions/auth";
import Image from "next/image";
import Logo from "@/public/logo.svg";

export default async function SignUpPage() {
  await redirectToDashboardIfSignedIn();

  return (
    <div className="flex flex-col gap-4 max-w-sm w-full items-center">
      <Image src={Logo} alt="Ragdoll" width={48} height={48} />
      <div className="w-full p-4">
        <SignUpForm />
      </div>
      <Link
        href="/login"
        className="text-sm text-center text-muted-foreground underline hover:text-foreground"
      >
        Already have an account? Log in
      </Link>
    </div>
  );
}
