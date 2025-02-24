"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import z from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale";

const FormSchema = z
    .object({
        email: z.string().email({ message: "E-mail inválido. Insira um e-mail válido.", }),
        password: z.string().min(6, { message: "Mínimo 6 caracteres" }),
        repeatPassword: z.string(),
        birthdate: z.date({ required_error: "Informe sua data de nascimento." }),
        gender: z.enum(["m", "f"], {
            required_error: "Selecione seu gênero.",
        }),
    })
    .refine((data) => data.password === data.repeatPassword, {
        message: "As senhas precisam ser iguais.",
        path: ["repeatPassword"], // Define o campo que receberá o erro
    });



const Register = () => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    return (
        <div className="flex items-center h-screen bg-main-500 flex-col gap-20 max-w-full">
            <h1 className="font-logo text-6xl mt-4 text-zinc-50">Joga +</h1>
            <div className="bg-main-300 p-3 rounded-xl border border-zinc-950 max-w-screen-sm flex flex-col w-[90%]">
                <h2 className="text-center font-impact text-3xl">Cadastro</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit((data) => console.log(data))} className="flex flex-col gap-2">
                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="email" className="text-lg">Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} id="email" placeholder="Example@gmail.com" type="email" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Senha */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="password" className="text-lg">Senha</FormLabel>
                                    <FormControl>
                                        <Input {...field} id="password" placeholder="******" type="password" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Repita Senha */}
                        <FormField
                            control={form.control}
                            name="repeatPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="repeatPassword" className="text-lg">Repita sua senha</FormLabel>
                                    <FormControl>
                                        <Input {...field} id="repeatPassword" placeholder="******" type="password" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Data Nascimento */}
                        <FormField
                            control={form.control}
                            name="birthdate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-lg">Nascimento</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal bg-inputbg-default",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP", { locale: ptBR })
                                                    ) : (
                                                        <span>Selecione sua data de nascimento</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Gênero */}
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg">Gênero</FormLabel>
                                    <FormControl>
                                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="m" id="male" />
                                                <Label className="text-base" htmlFor="male">Masculino</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="f" id="female" />
                                                <Label className="text-base" htmlFor="female">Feminino</Label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Botão de Cadastro */}
                        <div className="flex justify-center items-center">
                            <Button type="submit" variant="secondary" className="mt-9 text-zinc-50 text-lg px-8 text-center">
                                Cadastrar
                            </Button>
                        </div>
                    </form>
                </Form>

                <p className="text-base font-light text-center mt-4">
                    Já possui uma conta?{" "}
                    <Link href={"login"} className="text-secondary-400 italic hover:text-secondary-500 hover:underline transition-all duration-100">
                        Faça login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
