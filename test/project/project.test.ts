import request from 'supertest';
import { Server } from "http";
import { Application } from 'express';
import { createApp } from '../../src/server';
import { createDBConnection, closeDBConnection } from '../../src/config/database';
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

describe('get project', () => {
    test('should return all projects', async () => {
        const response = await request(app).get('/project')
    })
})
