import request from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../app.js';

describe('Auth endpoints', () => {
  it('registra un usuario nuevo', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'jugadorTest',
        email: 'jugador@test.cl',
        password: '123456',
      });

    expect(response.status).toBeLessThan(500);
    expect(response.body).toHaveProperty('message');
  });

  it('inicia sesión con credenciales correctas', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'jugadorTest',
        email: 'jugador@test.cl',
        password: '123456',
      });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'jugador@test.cl',
        password: '123456',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toContain('Login');
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('rechaza login con contraseña incorrecta', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'jugadorTest',
        email: 'jugador@test.cl',
        password: '123456',
      });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'jugador@test.cl',
        password: 'mala123',
      });

    expect(response.status).toBeGreaterThanOrEqual(400);
  });
});