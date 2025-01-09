import prisma  from '../prisma/client';
import { Request, Response } from 'express';
import { userService } from '../service/userService';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {z} from 'zod';
import { start } from 'repl';
import { tournamentService } from '../service/tournamentService';
import { get } from 'http';

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
    
    if (inscriptionStart >= inscriptionEnd) {
        res.status(400).json({ error: "Data de início das inscrições deve ser anterior ao fim." });
        return;
    }

    if (start >= end) {
        res.status(400).json({ error: "Data de início do torneio deve ser anterior ao fim." });
        return;
    }

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
    },

    getAllTournaments: async (req: Request, res: Response): Promise<void> => {
        try{
            const tournaments = await prisma.tournament.findMany({})
            console.log(tournaments);
            if(tournaments.length === 0){
                res.status(404).json({error: 'Nenhum torneio encontrado'});
                return;
            }

            res.status(200).json(tournaments);
        }catch(error: any){
            res.status(400).json({error: 'Erro ao buscar torneios' + error.message});
            return;
        }
    },

    getTournamentById: async (req: Request, res: Response): Promise<void> => {
        const {id} = req.params;

        try{
            const tournament = await prisma.tournament.findUnique({
                where: {
                    id: id
                }
            })

            if(!tournament){
                res.status(404).json({error: 'Nenhum torneio encontrado'});
                return;
            }

            res.status(200).json(tournament);
        }catch(error: any){
            res.status(400).json({error: 'Erro ao buscar torneios' + error.message});
            return;
        }
    },

    getTournamentsByUser: async (req: Request, res: Response): Promise<void> => {
        const {id} = req.params;

        try{
            const tournaments = await prisma.tournament.findMany({
                where: {
                    ownerId: id
                }
            });

            if(tournaments.length === 0){
                res.status(404).json({error: 'Nenhum torneio encontrado'});
                return;
            }

            res.status(200).json(tournaments);
        }catch(error: any){
            res.status(400).json({error: 'Erro ao buscar torneios' + error.message});
            return;
        }
    },


    updateTournament: async (req:Request, res: Response): Promise<void> =>{
        const {id} = req.params
        const tournamentSchema = z.object({
            id: z.string().uuid("Id informado inválido!"),
            name: z.string().min(1, "Nome não pode estar vazio").optional(),
            description: z.string().optional(),
            inscriptionStart: z.string().refine((date) => !isNaN(Date.parse(date)), {message: "Data de início das inscrições inválida, use o formato YYYY-MM-DD"}).optional(),
            inscriptionEnd: z.string().refine((date) => !isNaN(Date.parse(date)), {message: "Data de fim das inscrições inválida, use o formato YYYY-MM-DD"}).optional(),
            start: z.string().refine((date) => !isNaN(Date.parse(date)), {message: "Data de início do torneio inválida, use o formato YYYY-MM-DD"}).optional(),
            end: z.string().refine((date) => !isNaN(Date.parse(date)), {message: "Data de fim do torneio inválida, use o formato YYYY-MM-DD"}).optional(),
            city: z.string().min(1, "Cidade não pode estar vazia").optional(),
            state: z.string().min(1, "Estado não pode estar vazio").optional(),
            country: z.string().min(1, "País não pode estar vazio").optional(),
            spots: z.number().int().min(2, "Número de vagas deve ser no mínimo 2").optional(),
            categoryId: z.number().int().min(1, "Id da categoria inválido").optional(),
            modalityId: z.number().int().min(1, "Id da modalidade inválido").optional(),
            rules: z.string().optional(),
        })

        const validationResult = tournamentSchema.safeParse({...req.body, id});

        if(!validationResult.success){
            res.status(400).json({error: validationResult.error});
            return;
        }

        const tournamentExists = await prisma.tournament.findUnique({
            where: {
                id: validationResult.data.id
            }
        });

        if(!tournamentExists){
            res.status(404).json({error: 'Torneio não encontrado'});
            return;
        }

        const updatedData = validationResult.data;

        if(updatedData.categoryId){
            const category = await tournamentService.verifyCategory(updatedData.categoryId);
            if(!category){
                res.status(404).json({error: 'Categoria não encontrada'});
                return;
            }
        }

        if(updatedData.modalityId){
            const modality = await tournamentService.verifyModality(updatedData.modalityId);
            if(!modality){
                res.status(404).json({error: 'Modalidade não encontrada'});
                return;
            }
        }

        if (updatedData.inscriptionStart && updatedData.inscriptionEnd) {
            if (new Date(updatedData.inscriptionStart) >= new Date(updatedData.inscriptionEnd)) {
                res.status(400).json({ error: "Data de início das inscrições deve ser anterior ao fim." });
                return;
            }
        }

        if (updatedData.start && updatedData.end) {
            if (new Date(updatedData.start) >= new Date(updatedData.end)) {
                res.status(400).json({ error: "Data de início do torneio deve ser anterior ao fim." });
                return;
            }
        }

        try{
            const tournament = await prisma.tournament.update({
                where: {
                    id: validationResult.data.id
                },
                data: {
                    ...updatedData,
                    inscriptionStart: updatedData.inscriptionStart ? new Date(updatedData.inscriptionStart) : undefined,
                    inscriptionEnd: updatedData.inscriptionEnd ? new Date(updatedData.inscriptionEnd) : undefined,
                    start: updatedData.start ? new Date(updatedData.start) : undefined,
                    end: updatedData.end ? new Date(updatedData.end) : undefined,
                },
            })

            res.status(200).json({message: 'Torneio atualizado com sucesso!'});
            return;

    }catch(error: any){
        res.status(500).json({error: 'Erro ao atualizar torneio' + error.message});
        return;
    }
},

    finishTournament: async (req: Request, res: Response): Promise<void> => {
        const {id} = req.params;

        try{
            const tournament = await prisma.tournament.update({
                where: {
                    id
                },
                data: {
                    isFinished: true
                }
            })

            res.status(200).json({message: 'Torneio finalizado com sucesso!'});
            return;
        }catch(error: any){
            res.status(500).json({error: 'Erro ao finalizar torneio' + error.message});
            return;
        }
    }

}

export {tournamentController};