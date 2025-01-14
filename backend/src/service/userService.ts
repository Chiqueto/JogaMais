import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {z} from 'zod';
import { verify } from 'crypto';

const prisma = new PrismaClient();


export const userService = {
    verifyEmail: async (email: string) => {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        return user;
    },

    verifyUser: async (id: string) => {
        const user = await prisma.user.findUnique({
            where: {
                id
            }
        })

        return user;
    }
}

