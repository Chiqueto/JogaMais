import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {z} from 'zod';

const prisma = new PrismaClient();


export const userService = {
    verifyEmail: async (email: string) => {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        return user;
    }
}