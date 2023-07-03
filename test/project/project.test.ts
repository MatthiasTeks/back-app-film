import request from 'supertest';
import { Server } from "http";
import { Application } from 'express';
import { createApp } from '../../src/server';
import { createDBConnection, closeDBConnection } from '../../src/config/database';
import { Project } from '../../src/interface/Interface';
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
        const response = await request(app).get('/project');
        expect(response.status).toBe(200);
    })
})

describe('get highlighted project', () => {
    test('should return all projects that are highlighted', async () => {
        const response = await request(app).get('/project/highlight');
        expect(response.status).toBe(200);
        expect(response.body.every((project: Project) => project.is_highlight === 1)).toBe(true);
    })
})

describe('get project by label', () => {
    test('should return project by label', async () => {
        const response = await request(app).get('/project/label/matthias');
        expect(response.status).toBe(200);
        expect(response.body.label === "matthias").toBe(true);
    })
})
