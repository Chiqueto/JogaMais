import request from 'supertest';
import app from '../src/index';
import prisma from '../src/prisma/client'; 
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt"

// describe('POST /users', () => {
//     beforeAll(async () => {
//         await prisma.user.deleteMany();
//     });

//     afterAll(async () => {
//         // Fechar a conexão com o Prisma após os testes
//         await prisma.$disconnect();
//     });

//     afterEach(() => {
//         // Limpa todos os mocks
//         jest.clearAllMocks();
//     });

//     it('deve criar um novo usuário com sucesso', async () => {
//         const response = await request(app)
//             .post('/users')
//             .send({
//                 name: 'John Doe',
//                 email: 'john.doe@example.com',
//                 password: '123456',
//                 gender: 'Male',
//                 birth: '1990-01-01',
//                 city: 'New York',
//                 state: 'NY',
//                 country: 'USA',
//             });

//         expect(response.status).toBe(201);
//         expect(response.body).toHaveProperty('message', 'Usuário criado com sucesso!');
//         expect(response.body).toHaveProperty('email', 'john.doe@example.com');
//     });


//     it('deve retornar erro se o e-mail já estiver em uso', async () => {
//         const response = await request(app)
//             .post('/users')
//             .send({
//                 name: 'Jane Doe',
//                 email: 'john.doe@example.com', // Mesmo e-mail
//                 password: '123456',
//                 gender: 'Female',
//                 birth: '1992-01-01',
//                 city: 'Los Angeles',
//                 state: 'CA',
//                 country: 'USA',
//             });

//         expect(response.status).toBe(409);
//         expect(response.body).toHaveProperty('error', 'E-mail já está em uso');
//     });

//     it('deve retornar erro se algum campo obrigatório estiver ausente', async () => {
//         const response = await request(app)
//             .post('/users')
//             .send({
//                 email: 'missing.fields@example.com',
//                 password: '123456',
//             });

//         expect(response.status).toBe(400);
//         expect(response.body).toHaveProperty('error');
//     });

//     it('deve retornar erro se o nome estiver vazio', async () => {
//         const response = await request(app)
//             .post('/users')
//             .send({
//                 name: '',
//                 email: 'john.doe@example.com',
//                 password: '123456',
//                 gender: 'Male',
//                 birth: '1990-01-01',
//                 city: 'New York',
//                 state: 'NY',
//                 country: 'USA',
//             });

//         expect(response.status).toBe(400);
//         expect(response.body.error.issues[0].message).toBe('Nome não pode estar vazio');
//     });

//     it('deve retornar erro para email inválido', async () => {
//         const response = await request(app)
//             .post('/users')
//             .send({
//                 name: 'John Doe',
//                 email: 'invalid-email',
//                 password: '123456',
//                 gender: 'Male',
//                 birth: '1990-01-01',
//                 city: 'New York',
//                 state: 'NY',
//                 country: 'USA',
//             });

//         expect(response.status).toBe(400);
//         expect(response.body.error.issues[0].message).toBe('Formato de email inválido');
//     });

//     it('deve retornar erro para senha curta', async () => {
//         const response = await request(app)
//             .post('/users')
//             .send({
//                 name: 'John Doe',
//                 email: 'john.doe@example.com',
//                 password: '123',
//                 gender: 'Male',
//                 birth: '1990-01-01',
//                 city: 'New York',
//                 state: 'NY',
//                 country: 'USA',
//             });

//         expect(response.status).toBe(400);
//         expect(response.body.error.issues[0].message).toBe('Senha deve ter no mínimo 4 caracteres');
//     });

//     it('deve retornar erro para data de nascimento inválida', async () => {
//         const response = await request(app)
//             .post('/users')
//             .send({
//                 name: 'John Doe',
//                 email: 'john.doe@example.com',
//                 password: '123456',
//                 gender: 'Male',
//                 birth: '31-12-1990', // Formato inválido
//                 city: 'New York',
//                 state: 'NY',
//                 country: 'USA',
//             });

//         expect(response.status).toBe(400);
//         expect(response.body.error.issues[0].message).toBe('Data de nascimento inválida, use o formato YYYY-MM-DD');
//     });
    
// });

// describe('Login Controller', () => {
//     let validUser: { email: string; password: string };

//     beforeAll(async () => {
//         // Configuração de um usuário válido para o teste
//         const hashedPassword = await bcrypt.hash('123456', 10);

//         validUser = {
//             email: 'john.doe@example.com',
//             password: '123456',
//         };

//         await prisma.user.create({
//             data: {
//                 name: 'John Doe',
//                 email: validUser.email,
//                 password: hashedPassword,
//                 gender: 'Male',
//                 birth: new Date('1990-01-01'),
//                 city: 'New York',
//                 state: 'NY',
//                 country: 'USA',
//             },
//         });
//     });


//     it('deve realizar login com sucesso e retornar um token JWT', async () => {
//         const response = await request(app)
//             .post('/users/login') // Substitua pela rota correta
//             .send(validUser);

//         expect(response.status).toBe(201);
//         expect(response.body).toHaveProperty('message', 'Login realizado com sucesso!');
//         expect(response.body).toHaveProperty('token');

//         // Verificar se o token é válido
//         const decoded = jwt.verify(response.body.token, String(process.env.SECRET_KEY));
//         expect(decoded).toHaveProperty('id');
//         expect(decoded).toHaveProperty('email', validUser.email);
//     });

//     it('deve retornar erro ao tentar login com senha incorreta', async () => {
//         const response = await request(app)
//             .post('/users/login') // Substitua pela rota correta
//             .send({
//                 email: validUser.email,
//                 password: 'wrongpassword',
//             });

//         expect(response.status).toBe(400);
//         expect(response.body).toHaveProperty('error', 'Usuário ou senha incorretos!');
//     });

//     it('deve retornar erro ao tentar login com email inexistente', async () => {
//         const response = await request(app)
//             .post('/users/login') // Substitua pela rota correta
//             .send({
//                 email: 'nonexistent@example.com',
//                 password: '123456',
//             });

//         expect(response.status).toBe(400);
//         expect(response.body).toHaveProperty('error', 'Usuário ou senha incorretos!');
//     });

//     it('deve retornar erro para formato de email inválido', async () => {
//         const response = await request(app)
//             .post('/users/login') // Substitua pela rota correta
//             .send({
//                 email: 'invalidemail',
//                 password: '123456',
//             });

//         expect(response.status).toBe(400);
//         expect(response.body.error).toHaveProperty('issues');
//         expect(response.body.error.issues[0]).toHaveProperty('message', 'Formato de e-mail inválido');
//     });

//     it('deve retornar erro para senha curta', async () => {
//         const response = await request(app)
//             .post('/users/login') // Substitua pela rota correta
//             .send({
//                 email: validUser.email,
//                 password: '123',
//             });

//         expect(response.status).toBe(400);
//         expect(response.body.error).toHaveProperty('issues');
//         expect(response.body.error.issues[0]).toHaveProperty('message', 'Senha deve ter no mínimo 4 caracteres');
//     });
// });

// describe('Get All Users Controller', () => {
//     let token: string;

//     beforeAll(async () => {
//         // Gerar um token JWT para a autenticação (substitua pelos dados de um usuário válido)
//         const createUserResponse = await request(app)
//             .post('/users')
//             .send({
//                 name: 'John Doe',
//                 email: 'john.doe@example.com',
//                 password: '123456',
//                 gender: 'Male',
//                 birth: '1990-01-01',
//                 city: 'New York',
//                 state: 'NY',
//                 country: 'USA',
//             });

//         // Verificar se o usuário foi criado corretamente
//         expect(createUserResponse.status).toBe(201);
//         expect(createUserResponse.body).toHaveProperty('message', 'Usuário criado com sucesso!');
//         expect(createUserResponse.body).toHaveProperty('email', 'john.doe@example.com');

//         // Realizar login para obter o token JWT
//         const response = await request(app)
//             .post('/users/login') // Substitua pela rota correta
//             .send({email: "john.doe@example.com", password: "123456"});

//         expect(response.status).toBe(201);
//         expect(response.body).toHaveProperty('message', 'Login realizado com sucesso!');
//         expect(response.body).toHaveProperty('token');
//         token = response.body.token
//     });

//     afterAll(async () => {
//         // Limpar o banco de dados após os testes
//         await prisma.user.deleteMany({
//             where: { email: 'john.doe@example.com' },
//         });
//         await prisma.$disconnect();
//     });

//     it('deve retornar todos os usuários com sucesso', async () => {
//         const response = await request(app)
//             .get('/users') // Substitua pela rota correta
//             .set('Authorization', `Bearer ${token}`); // Enviando o token JWT na header de autorização

//         expect(response.status).toBe(200);
//         expect(Array.isArray(response.body)).toBe(true);
//         expect(response.body.length).toBeGreaterThan(0); // Verifica se ao menos 1 usuário foi retornado
//     });

//     it('deve retornar erro 401 se o token de autenticação não for fornecido', async () => {
//         const response = await request(app)
//             .get('/users'); // Não incluir o token JWT

//         expect(response.status).toBe(401);
//         expect(response.body).toHaveProperty('error', 'Acesso negado. Token não fornecido.');
//     });

//     it('deve retornar erro 500 se ocorrer um erro interno do servidor', async () => {
//         // Simula falha no banco de dados
//         jest.spyOn(prisma.user, 'findMany').mockRejectedValueOnce(new Error('Erro ao buscar usuários'));

//         const response = await request(app)
//             .get('/users')
//             .set('Authorization', `Bearer ${token}`);

//         expect(response.status).toBe(500);
//         expect(response.body).toHaveProperty('error', 'Erro interno do servidorErro ao buscar usuários');
//     });

//     it('deve retornar erro 404 se não houver usuários no banco de dados', async () => {
//         // Deleta todos os usuários para simular o cenário onde não há usuários
//         await prisma.user.deleteMany();

//         const response = await request(app)
//             .get('/users')
//             .set('Authorization', `Bearer ${token}`);

//         expect(response.status).toBe(404);
//         expect(response.body).toHaveProperty('error', 'Nenhum usuário encontrado');
//     });
    
// });

// describe('Get User By ID Controller', () => {
//     let token: string;
//     let userId: string;

//     beforeAll(async () => {
//         // Criar um usuário e armazenar o ID para o teste
//         await prisma.user.deleteMany()
//         const createUserResponse = await request(app)
//             .post('/users') // Substitua pela rota de criação de usuário
//             .send({
//                 name: 'Jane Doe',
//                 email: 'jane.doe@example.com',
//                 password: '123456',
//                 gender: 'Female',
//                 birth: '1995-05-15',
//                 city: 'Los Angeles',
//                 state: 'CA',
//                 country: 'USA',
//             });

//         expect(createUserResponse.status).toBe(201);

//         // Realizar login para obter o token JWT
//         const response = await request(app)
//             .post('/users/login') // Substitua pela rota correta
//             .send({email: "jane.doe@example.com", password: "123456"});

//         expect(response.status).toBe(201);
//         expect(response.body).toHaveProperty('message', 'Login realizado com sucesso!');
//         expect(response.body).toHaveProperty('token');
//         token = response.body.token
//         userId = response.body.user.id
//     });

//     afterAll(async () => {
//         // Limpar o banco de dados após os testes
//         await prisma.user.deleteMany({
//             where: { email: 'jane.doe@example.com' },
//         });
//         await prisma.$disconnect();
//     });

//     it('deve retornar os dados do usuário quando o ID for válido', async () => {
//         const response = await request(app)
//             .get(`/users/${userId}`) // Substitua pela rota correta
//             .set('Authorization', `Bearer ${token}`);

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty('id', userId);
//         expect(response.body).toHaveProperty('email', 'jane.doe@example.com');
//     });

//     it('deve retornar erro 400 se o ID for inválido', async () => {
//         const invalidId = '123';
//         const response = await request(app)
//             .get(`/users/${invalidId}`)
//             .set('Authorization', `Bearer ${token}`);

//         expect(response.status).toBe(400);
//         expect(response.body).toHaveProperty('error');
//     });

//     it('deve retornar erro 404 se o usuário não for encontrado', async () => {
//         const nonExistentId = '550e8400-e29b-41d4-a716-446655440000'; // Um UUID válido, mas que não existe no banco
//         const response = await request(app)
//             .get(`/users/${nonExistentId}`)
//             .set('Authorization', `Bearer ${token}`);

//         expect(response.status).toBe(404);
//         expect(response.body).toHaveProperty('error', 'Usuário não encontrado');
//     });

//     it('deve retornar erro 500 se ocorrer um erro interno do servidor', async () => {
//         // Simula um erro no Prisma
//         jest.spyOn(prisma.user, 'findUnique').mockRejectedValueOnce(new Error('Erro ao buscar usuário'));

//         const response = await request(app)
//             .get(`/users/${userId}`)
//             .set('Authorization', `Bearer ${token}`);

//         expect(response.status).toBe(500);
//         expect(response.body).toHaveProperty('error', expect.stringContaining('Erro interno do servidor'));
//     });
// });

// describe('Update User Controller', () => {
//     let token: string;
//     let userId: string;

//     beforeAll(async () => {
//         // Limpar dados antigos e criar um usuário para o teste
//         await prisma.user.deleteMany();
//         const createUserResponse = await request(app)
//             .post('/users') // Substitua pela rota de criação de usuário
//             .send({
//                 name: 'Jane Doe',
//                 email: 'jane.doe@example.com',
//                 password: '123456',
//                 gender: 'Female',
//                 birth: '1995-05-15',
//                 city: 'Los Angeles',
//                 state: 'CA',
//                 country: 'USA',
//             });

//         expect(createUserResponse.status).toBe(201);

//         // Realizar login para obter o token JWT
//         const response = await request(app)
//             .post('/users/login') // Substitua pela rota correta
//             .send({ email: 'jane.doe@example.com', password: '123456' });

//         expect(response.status).toBe(201);
//         expect(response.body).toHaveProperty('message', 'Login realizado com sucesso!');
//         expect(response.body).toHaveProperty('token');
//         token = response.body.token;
//         userId = response.body.user.id;
//     });

//     afterAll(async () => {
//         // Limpar o banco de dados após os testes
//         await prisma.user.deleteMany();
//         await prisma.$disconnect();
//     });

//     it('deve atualizar os dados do usuário quando os dados são válidos', async () => {
//         const updatedData = {
//             name: 'Jane Smith',
//             email: 'jane.smith@example.com',
//             gender: 'Female',
//             birth: '1995-06-20T00:00:00.000Z',
//             city: 'San Francisco',
//             state: 'CA',
//             country: 'USA',
//         };

//         const response = await request(app)
//             .put(`/users/${userId}`) // Substitua pela rota correta
//             .set('Authorization', `Bearer ${token}`)
//             .send(updatedData);

//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty('message', 'Usuário atualizado com sucesso');

//         // Verifique se os dados foram atualizados no banco
//         const updatedUser = await prisma.user.findUnique({ where: { id: userId } });
//         // expect(updatedUser).toMatchObject(updatedData);
//     });

//     it('deve retornar erro 400 se os dados forem inválidos', async () => {
//         const invalidData = {
//             name: '',
//             email: 'invalid-email',
//             gender: '',
//             birth: 'invalid-date',
//             city: '',
//             state: '',
//             country: '',
//         };

//         const response = await request(app)
//             .put(`/users/${userId}`)
//             .set('Authorization', `Bearer ${token}`)
//             .send(invalidData);

//         expect(response.status).toBe(400);
//         expect(response.body).toHaveProperty('error');
//     });

//     it('deve retornar erro 404 se o usuário não for encontrado', async () => {
//         const nonExistentId = '550e8400-e29b-41d4-a716-446655440000'; // UUID válido, mas que não existe no banco
//         const validData = {
//             name: 'Jane Doe',
//             email: 'jane.doe@example.com',
//             gender: 'Female',
//             birth: '1995-05-15',
//             city: 'Los Angeles',
//             state: 'CA',
//             country: 'USA',
//         };

//         const response = await request(app)
//             .put(`/users/${nonExistentId}`)
//             .set('Authorization', `Bearer ${token}`)
//             .send(validData);

//         expect(response.status).toBe(404);
//         expect(response.body).toHaveProperty('error', 'Usuário não encontrado');
//     });

//     it('deve retornar erro 500 se ocorrer um erro interno do servidor', async () => {
//         const validData = {
//             name: 'Jane Doe',
//             email: 'jane.doe@example.com',
//             gender: 'Female',
//             birth: '1995-05-15',
//             city: 'Los Angeles',
//             state: 'CA',
//             country: 'USA',
//         };

//         jest.spyOn(prisma.user, 'update').mockRejectedValueOnce(new Error('Erro ao atualizar usuário'));

//         const response = await request(app)
//             .put(`/users/${userId}`)
//             .set('Authorization', `Bearer ${token}`)
//             .send(validData);

//         expect(response.status).toBe(500);
//         expect(response.body).toHaveProperty('error', expect.stringContaining('Erro interno do servidor'));
//     });
// });


//