import request from 'supertest';
import app from '../src/index';
import prisma from '../src/prisma/client';

describe('Create Tournament Controller', () => {
    let ownerId: string;
    let token: string;

    beforeAll(async () => {
        // Limpar banco e criar um usuário para testes
        await prisma.tournament.deleteMany();
        await prisma.user.deleteMany();
        const user = await request(app)
            .post('/users') // Substitua pela rota de criação de usuário
            .send({
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: '123456', // Hash se necessário
                gender: 'Male',
                birth: new Date('1990-01-01'),
                city: 'New York',
                state: 'NY',
                country: 'USA',
            });


        // Realizar login para obter o token JWT
        const response = await request(app)
            .post('/users/login') // Substitua pela rota correta
            .send({ email: 'john.doe@example.com', password: '123456' });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Login realizado com sucesso!');
        expect(response.body).toHaveProperty('token');
        ownerId = response.body.user.id;

        token = response.body.token;
    });

    afterAll(async () => {
        // Limpar banco após os testes
        await prisma.tournament.deleteMany();
        await prisma.user.deleteMany();
        await prisma.$disconnect();
    });

    it('deve criar um torneio com sucesso', async () => {
        const response = await request(app)
            .post('/tournaments')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Torneio Teste',
                description: 'Torneio para testes',
                ownerId,
                inscriptionStart: '2025-01-01',
                inscriptionEnd: '2025-01-10',
                start: '2025-01-15',
                end: '2025-01-20',
                city: 'São Paulo',
                state: 'SP',
                country: 'Brasil',
                spots: 16,
                categoryId: 1, // Mockado
                modalityId: 2, // Mockado
                rules: 'Seguir as regras da modalidade.',
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Torneio criado com sucesso!');
    });

    it('deve retornar erro 400 se o nome estiver vazio', async () => {
        const response = await request(app)
            .post('/tournaments')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: '',
                ownerId,
                inscriptionStart: '2025-01-01',
                inscriptionEnd: '2025-01-10',
                start: '2025-01-15',
                end: '2025-01-20',
                city: 'São Paulo',
                state: 'SP',
                country: 'Brasil',
                spots: 16,
                categoryId: 1,
                modalityId: 2,
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it('deve retornar erro 404 se o dono do torneio não existir', async () => {
        const response = await request(app)
            .post('/tournaments')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Torneio Teste',
                ownerId: '550e8400-e29b-41d4-a716-446655440000', // UUID válido, mas inexistente
                inscriptionStart: '2025-01-01',
                inscriptionEnd: '2025-01-10',
                start: '2025-01-15',
                end: '2025-01-20',
                city: 'São Paulo',
                state: 'SP',
                country: 'Brasil',
                spots: 16,
                categoryId: 1,
                modalityId: 2,
            });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Usuário não encontrado');
    });

    it('deve retornar erro 404 se a categoria não existir', async () => {
        const response = await request(app)
            .post('/tournaments')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Torneio Teste',
                ownerId,
                inscriptionStart: '2025-01-01',
                inscriptionEnd: '2025-01-10',
                start: '2025-01-15',
                end: '2025-01-20',
                city: 'São Paulo',
                state: 'SP',
                country: 'Brasil',
                spots: 16,
                categoryId: 999, // Categoria inexistente
                modalityId: 2,
            });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Categoria não encontrada');
    });

    it('deve retornar erro 404 se a modalidade não existir', async () => {
        const response = await request(app)
            .post('/tournaments')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Torneio Teste',
                ownerId,
                inscriptionStart: '2025-01-01',
                inscriptionEnd: '2025-01-10',
                start: '2025-01-15',
                end: '2025-01-20',
                city: 'São Paulo',
                state: 'SP',
                country: 'Brasil',
                spots: 16,
                categoryId: 1,
                modalityId: 999, // Modalidade inexistente
            });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Modalidade não encontrada');
    });

    it('deve retornar erro 400 se o número de vagas for menor que 2', async () => {
        const response = await request(app)
            .post('/tournaments')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Torneio Teste',
                ownerId,
                inscriptionStart: '2025-01-01',
                inscriptionEnd: '2025-01-10',
                start: '2025-01-15',
                end: '2025-01-20',
                city: 'São Paulo',
                state: 'SP',
                country: 'Brasil',
                spots: 1, // Número de vagas inválido
                categoryId: 1,
                modalityId: 2,
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });
});


