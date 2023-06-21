import request from 'supertest';
import { Server } from "http";
import { Application } from 'express';
import { createApp } from '../src/server';
import { createDBConnection, closeDBConnection } from '../src/config/database';
import dotenv from "dotenv";
dotenv.config();

let server: Server;
let app: Application;

beforeEach(async () => {
  await createDBConnection();
  app = await createApp();
  server = app.listen();
});

afterEach(async () => {
  await closeDBConnection();
  server.close();
});

describe('Login User', () => {
    test('should return 200 and a token when valid credentials are provided', async () => {
      const validCredentials = {
        mail: process.env.ADMIN_MAIL,
        password: process.env.ADMIN_PASSWORD,
      };
  
      const response = await request(app)
        .post('/user/login')
        .send(validCredentials);
  
      expect(response.status).toBe(200);
      expect(response.header).toHaveProperty('x-access-token');
    });

    test('should return 401 when no credentials are provided', async () => {
        const response = await request(app)
            .post('/user/login')

        expect(response.status).toBe(401);
    })

    test('should return 401 if credentials are invalid', async () => {
        const invalidCredentials = {
            mail: 'invalid',
            password: 'invalid',
        };

        const response = await request(app)
            .post('/user/login')
            .send(invalidCredentials);

        expect(response.status).toBe(401);
        expect(response.headers).not.toHaveProperty('x-access-token');
    })
});