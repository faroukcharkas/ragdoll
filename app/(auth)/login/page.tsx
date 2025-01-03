import { LoginForm } from "./parts/form";
import Link from "next/link";
import { redirectToDashboardIfSignedIn } from "@/actions/auth";
import Image from "next/image";
import Logo from "@/public/logo.svg";

export default async function LoginPage() {
  await redirectToDashboardIfSignedIn();

  return (
    <div className="flex flex-col gap-4 max-w-sm w-full items-center">
      <Image src={Logo} alt="Ragdoll" width={48} height={48} />
      <div className="w-full p-4">
        <LoginForm />
      </div>
      <Link href="/signup" className="text-sm text-center">
        No account? Sign up
      </Link>
    </div>
  );
}
