import prisma  from '../prisma/client';
import { Request, Response } from 'express';
import { userService } from '../service/userService';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {z} from 'zod';

const JWT_SECRET = String(process.env.SECRET_KEY)
const JWT_EXPIRATION = '1h'


const userController = {
    createUser : async (req: Request, res: Response): Promise<void> => {
        const createUserSchema = z.object({
            name: z.string().min(1, "Nome não pode estar vazio"),
            email: z.string().email("Formato de email inválido"),
            password: z.string().min(4, "Senha deve ter no mínimo 4 caracteres"),
            gender: z.string().min(1, "Gênero não pode estar vazio"),
            birth: z.string().refine((date) => !isNaN(Date.parse(date)), {message: "Data de nascimento inválida, use o formato YYYY-MM-DD"}),
            city: z.string().min(1, "Cidade não pode estar vazia"),
            state: z.string().min(1, "Estado não pode estar vazio"),
            country: z.string().min(1, "País não pode estar vazio"),
            cep: z.string().min(9, "Cep deve estar no formato 00000-000").refine((cep) => cep.match(/^\d{5}-\d{3}$/), {message: "Cep deve estar no formato 00000-000"})

        })
        const validationResult = createUserSchema.safeParse(req.body) ;
    
        if (!validationResult.success) {
            res.status(400).json({ error: validationResult.error });
            return;
        }
    
        if(await userService.verifyEmail(validationResult.data.email)){
            res.status(409).json({error: 'E-mail já está em uso'});
            return;
        }
    
        const {name, email, password, gender, birth, city, state, country, cep} = validationResult.data;
    
        
        try{
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    gender,
                    birth: new Date(birth),
                    city,
                    state,
                    country,
                    cep
                }
            })

            res.status(201).json({message: "Usuário criado com sucesso!", email: user.email});
            return
        }catch(error: any){
            res.status(400).json({error: 'Erro ao criar usuário' + error.message});
            return
        }
    },

    getAllUsers: async (req: Request, res: Response): Promise<void> => {
        try{
            const users = await prisma.user.findMany();
            if(users.length === 0){
                res.status(404).json({error: 'Nenhum usuário encontrado'});
                return;
            }else{
                res.status(200).json(users);
                return
            }
        }catch(error: any){
            res.status(500).json({error: 'Erro interno do servidor' + error.message});
            return;
        }
    },

    getUserById: async (req: Request, res: Response): Promise<void> => {
        const {id} = req.params;
        const getUserByIdSchema = z.object({
            id: z.string().uuid("ID inválido")

        });
        const validationResult = getUserByIdSchema.safeParse({id});
        if(!validationResult.success){
            res.status(400).json({error: validationResult.error});
            return;     
        }

        try{
            const user = await prisma.user.findUnique({
                where: {
                    id: validationResult.data.id
                }
            });

            if(!user){
                res.status(404).json({error: 'Usuário não encontrado'});
                return;
            }

            res.status(200).json(user);
        }catch(error: any){
            res.status(500).json({error: 'Erro interno do servidor' + error.message});
        }
    },

    updateUser: async (req: Request, res: Response): Promise<void> => {
        const {id} = req.params;
        const updateUserSchema = z.object({
            id: z.string().uuid("ID inválido"),
            name: z.string().min(1, "Nome não pode estar vazio"),
            email: z.string().email("Formato de email inválido"),
            gender: z.string().min(1, "Gênero não pode estar vazio"),
            birth: z.string().refine((date) => !isNaN(Date.parse(date)), {message: "Data de nascimento inválida, use o formato YYYY-MM-DD"}),
            city: z.string().min(1, "Cidade não pode estar vazia"),
            state: z.string().min(1, "Estado não pode estar vazio"),
            country: z.string().min(1, "País não pode estar vazio"),
            cep: z.string().min(9, "Cep deve estar no formato 00000-000").refine((cep) => cep.match(/^\d{5}-\d{3}$/), {message: "Cep deve estar no formato 00000-000"})
        })

        

        const validationResult = updateUserSchema.safeParse({...req.body, id});

        const userExists = await prisma.user.findUnique({
            where: {
                id
            }
        });

        if(!userExists){
            res.status(404).json({error: 'Usuário não encontrado'});
            return;
        }

        if(!validationResult.success){
            res.status(400).json({error: validationResult.error});
            return;
        }
        
        

        const {name, email, gender, birth, city, state, country, cep} = validationResult.data;

        try{
            const user = await prisma.user.update({
                where: {
                    id
                },
                data: {
                    name,
                    email,
                    gender,
                    birth: new Date(birth),
                    city,
                    state,
                    country,
                    cep
                }
            })

            if(!user ){
                res.status(400).json({error: 'Erro ao atualizar usuário'});
                return;
            }

            res.status(200).json({message: 'Usuário atualizado com sucesso'});
        }catch(error: any){
            res.status(500).json({error: 'Erro interno do servidor' + error.message});
        }


    },

    login: async(req: Request, res: Response): Promise<void> => {
        const loginSchema = z.object({
            email: z.string().email("Formato de e-mail inválido"),
            password: z.string().min(4, "Senha deve ter no mínimo 4 caracteres")
        })

        const validationResult = loginSchema.safeParse(req.body)

        if(!validationResult.success){
            res.status(400).json({error: validationResult.error})
            return
        }

        const{ email, password } = validationResult.data

        try{
            const user = await userService.verifyEmail(email)

            if(!user){
                res.status(400).json({error: "Usuário ou senha incorretos!"})
                return
            }

            const verifyPassword = await bcrypt.compare(password, user.password)

            if(!verifyPassword){
                res.status(400).json({error: "Usuário ou senha incorretos!"})
                return
            }

            const token = jwt.sign({id: user.id, email: user.email}, JWT_SECRET, {expiresIn: JWT_EXPIRATION})

            res.status(201).json({message: "Login realizado com sucesso!", token, user})
        }catch(error: any){
            res.status(500).json({error: "Erro interno do servidor: " + error.message})
        }
    }

    

}

export {userController} ;