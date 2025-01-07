import request from 'supertest';
import app from '../src/index';
import prisma from '../src/prisma/client'; 

describe('POST /users', () => {
    // beforeAll(async () => {
    //     await prisma.user.deleteMany();
    // });

    // afterAll(async () => {
    //     // Fechar a conexão com o Prisma após os testes
    //     await prisma.$disconnect();
    // });

    it('deve criar um novo usuário com sucesso', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: '123456',
                gender: 'Male',
                birth: '1990-01-01',
                city: 'New York',
                state: 'NY',
                country: 'USA',
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Usuário criado com sucesso!');
        expect(response.body).toHaveProperty('email', 'john.doe@example.com');
    });

    it('deve retornar erro se o e-mail já estiver em uso', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                name: 'Jane Doe',
                email: 'john.doe@example.com', // Mesmo e-mail
                password: '123456',
                gender: 'Female',
                birth: '1992-01-01',
                city: 'Los Angeles',
                state: 'CA',
                country: 'USA',
            });

        expect(response.status).toBe(409);
        expect(response.body).toHaveProperty('error', 'E-mail já está em uso.');
    });

    it('deve retornar erro se algum campo obrigatório estiver ausente', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                email: 'missing.fields@example.com',
                password: '123456',
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });
});