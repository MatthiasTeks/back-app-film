import request from 'supertest';
import { Server } from "http";
import { Application } from 'express';
import { createApp } from '../../src/server';
import { createDBConnection, closeDBConnection } from '../../src/config/database';
import * as user from '../../src/models/user';

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


describe('Sign Up User', () => {
  test('should create a new user and return 200', async () => {
    const newUser = {
      mail: 'test@example.com',
      password: 'password123',
    };

    const response = await request(app)
      .post('/user/sign-up')
      .send(newUser);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'User created successfully' });
  });

  test('should return 500 when failed to create user', async () => {
    const newUser = {
      mail: 'test@example.com',
      password: 'password123',
    };

    const postUserSpy = jest.spyOn(user, 'postUser');
    postUserSpy.mockResolvedValueOnce(undefined);

    const response = await request(app)
      .post('/user/sign-up')
      .send(newUser);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Failed to create user' });

    postUserSpy.mockRestore();
  });
});