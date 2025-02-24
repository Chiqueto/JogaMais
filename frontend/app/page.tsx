import { Button } from "@/components/ui/button";
import HomeCarrousel from "./_components/homeCarrousel";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center h-screen bg-main-500 flex-col text-zinc-50 ">
      <h1 className="font-logo text-6xl mt-4 ">Joga +</h1>
      <HomeCarrousel />
      <Button asChild variant={"secondary"} size={"lg"} className=" mt-auto mb-4"> <Link href={"login"}>Iniciar agora</Link> </Button>
    </div >
  );
}
