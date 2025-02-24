import { Button } from "@/components/ui/button";
import InputWithLabel from "../_components/inputWithLabel";
import Link from "next/link";
import Image from "next/image";

const login = () => {
    return (
        <div className="flex items-center h-screen bg-main-500 flex-col gap-20 max-w-full">
            <h1 className="font-logo text-6xl mt-4 text-zinc-50">Joga +</h1>
            <div className="bg-main-300 p-3 rounded-xl border border-zinc-950 max-w-screen-sm flex flex-col w-[90%] relative">
                <Image src={"login_volley.svg"} width={"70"} height={240} alt="volley" className="absolute -right-3 -top-28" />
                <h2 className="text-center font-impact text-3xl ">Login</h2>
                <InputWithLabel htmlfor="email" id="email" labelText="E-mail" placeholder="E-mail" type="email" />
                <InputWithLabel htmlfor="password" id="password" labelText="Senha" placeholder="*******" type="password" />
                <div className="flex justify-center items-center"><Button variant={"secondary"} className="mt-9 text-zinc-50 text-lg px-8 text-center">Login</Button></div>
                <p className="text-base font-light text-center mt-4">Não tem uma conta? <Link href={"register"} className="text-secondary-400 italic hover:text-secondary-500 hover:underline transition-all duration-100">Cadastre-se</Link></p>
            </div>
        </div>
    );
}

export default login;