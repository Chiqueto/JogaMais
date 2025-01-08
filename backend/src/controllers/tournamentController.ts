import prisma  from '../prisma/client';
import { Request, Response } from 'express';
import { userService } from '../service/userService';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {z} from 'zod';
import { start } from 'repl';
import { tournamentService } from '../service/tournamentService';

const JWT_SECRET = String(process.env.SECRET_KEY)
const JWT_EXPIRATION = '1h'

const tournamentController = {

    createTournament: async (req: Request, res: Response): Promise<void> => {
        const createTournamentSchema = z.object({
            name: z.string().min(1, "Nome não pode estar vazio"),
            description: z.string().optional(),
            ownerId: z.string().uuid("Id do dono do torneio inválido"),
            inscriptionStart: z.string().refine((date) => !isNaN(Date.parse(date)), {message: "Data de início das inscrições inválida, use o formato YYYY-MM-DD"}),
            inscriptionEnd: z.string().refine((date) => !isNaN(Date.parse(date)), {message: "Data de fim das inscrições inválida, use o formato YYYY-MM-DD"}),
            start: z.string().refine((date) => !isNaN(Date.parse(date)), {message: "Data de início do torneio inválida, use o formato YYYY-MM-DD"}),
            end: z.string().refine((date) => !isNaN(Date.parse(date)), {message: "Data de fim do torneio inválida, use o formato YYYY-MM-DD"}),
            city: z.string().min(1, "Cidade não pode estar vazia"),
            state: z.string().min(1, "Estado não pode estar vazio"),
            country: z.string().min(1, "País não pode estar vazio"),
            spots: z.number().int().min(2, "Número de vagas deve ser no mínimo 2"),
            categoryId: z.number().int().min(1, "Id da categoria inválido"),
            modalityId: z.number().int().min(1, "Id da modalidade inválido"),
            rules: z.string().optional(),
    })

    const validationResult = createTournamentSchema.safeParse(req.body) ;

    if(!validationResult.success){
        res.status(400).json({ error: validationResult.error });
        return;
    }

    const user = await userService.verifyUser(validationResult.data.ownerId);
    if(!user){
        res.status(404).json({error: 'Usuário não encontrado'});
        return;
    }

    const category = await tournamentService.verifyCategory(validationResult.data.categoryId);
    if(!category){
        res.status(404).json({error: 'Categoria não encontrada'});
        return;
    }

    const modality = await tournamentService.verifyModality(validationResult.data.modalityId);
    if(!modality){
        res.status(404).json({error: 'Modalidade não encontrada'});
        return;
    }

    const {name, description, ownerId, inscriptionStart, inscriptionEnd, start, end, city, state, country, spots, categoryId, modalityId, rules} = validationResult.data;

    try{
        const tournament = await prisma.tournament.create({
            data: {
                name,
                description,
                ownerId,
                inscriptionStart: new Date(inscriptionStart),
                inscriptionEnd: new Date(inscriptionEnd),
                start: new Date(start),
                end: new Date(end),
                city,
                state,
                country,
                spots,
                categoryId,
                modalityId,
                rules
            }
        })

        if(!tournament){
            res.status(400).json({error: 'Erro ao criar torneio'});
            return;
        }

        res.status(201).json({message: "Torneio criado com sucesso!"})
        return
        } catch(error: any){
            res.status(400).json({error: 'Erro ao criar torneio' + error.message});
            return;

            }
    }
}

export {tournamentController};