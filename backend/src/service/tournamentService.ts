import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {z} from 'zod';
import { verify } from 'crypto';

const prisma = new PrismaClient();


export const tournamentService = {
    verifyCategory: async (id: number) => {
        const category = await prisma.categories.findUnique({
            where: {
                id
            }
        })

        return category;
    },

    verifyModality: async (id: number) => {
        const modality = await prisma.modalities.findUnique({
            where: {
                id
            }
        })

        return modality;
    }
}

