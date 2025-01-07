import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { userService } from '../service/userService';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {z} from 'zod';

const prisma = new PrismaClient();


const userController = {
    createUser : async (req: Request, res: Response): Promise<void> => {
        console.log('entrou')
        const createUserSchema = z.object({
            name: z.string().min(1, "Nome não pode estar vazio"),
            email: z.string().email("Formato de email inválido"),
            password: z.string().min(4, "Senha deve ter no mínimo 4 caracteres"),
            gender: z.string().min(1, "Gênero não pode estar vazio"),
            birth: z.string().refine((date) => !isNaN(Date.parse(date)), {message: "Data de nascimento inválida, use o formato YYYY-MM-DD"}),
            city: z.string().min(1, "Cidade não pode estar vazia"),
            state: z.string().min(1, "Estado não pode estar vazio"),
            country: z.string().min(1, "País não pode estar vazio")
        })
        const validationResult = createUserSchema.safeParse(req.body) ;
    
        if (!validationResult.success) {
            res.status(400).json({ error: validationResult.error });
            return;
        }
    
        // if(await userService.verifyEmail(validationResult.data.email)){
        //     res.status(400).json({error: 'Email já está em uso'});
        //     return;
        // }
    
        const {name, email, password, gender, birth, city, state, country} = validationResult.data;
    
        
        try{
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log(hashedPassword)
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    gender,
                    birth: new Date(birth),
                    city,
                    state,
                    country
                }
            })
    
            console.log(user);

            res.status(201).json({message: "Usuário criado com sucesso!", email: user.email});
        }catch(error){
            
            res.status(400).json({error: 'Erro ao criar usuário'});
        }
    }
}

export {userController} ;