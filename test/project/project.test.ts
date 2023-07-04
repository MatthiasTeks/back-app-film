import request from 'supertest';
import { Server } from "http";
import { Application } from 'express';
import { createApp } from '../../src/server';
import { createDBConnection, closeDBConnection } from '../../src/config/database';
import { Project } from '../../src/interface/Interface';
import dotenv from "dotenv";
import { object } from 'joi';
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

describe('update project by id', () => {
    test('should update project by id successfully', async () => {
        const updatedProject = {
            id_project: 1,
            name: 'Elton John',
            label: 'eltonjohn',
            type: 'bande-demo',
            journey: 'journee',
            s3_image_key: 'prescilla-V4-.webp',
            s3_video_key: 'lea_gouzy.mp4',
            date: '13/08/2019',
            place: 'Bordeaux',
            credit: 'Jean Paskal',
            is_highlight: 0
        }

        const response = await request(app)
            .put('/project/update/1')
            .send(updatedProject)

        expect(response.status).toBe(200);
        expect(typeof response.body).toBe("object");
    })
})

/* describe('get page project', () => {
    test('should return 6 projects depend on page number', async () => {

    })
}) */
