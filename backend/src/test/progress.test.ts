import request from 'supertest';
import { describe, expect, it } from 'vitest';

import app from '../app.js';

const createUserAndLogin = async () => {
  await request(app)
    .post('/api/auth/register')
    .send({
      username: 'jugadorProgress',
      email: 'progress@test.cl',
      password: '123456',
    });

  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'progress@test.cl',
      password: '123456',
    });

  return loginResponse.headers['set-cookie'];
};

describe('Progress endpoints', () => {
  it('rechaza guardar progreso sin estar autenticado', async () => {
    const response = await request(app)
      .post('/api/progress')
      .send({
        slot: 'main',
        scene: 'SceneP1',
      });

    expect(response.status).toBe(401);
  });

  it('guarda progreso con usuario autenticado', async () => {
    const cookies = await createUserAndLogin();

    const response = await request(app)
      .post('/api/progress')
      .set('Cookie', cookies)
      .send({
        slot: 'main',
        scene: 'SceneP1',
        players: {
          p1: { x: 120, y: 300 },
          p2: { x: 500, y: 300 },
        },
        inventory: {
          p1: ['teddy'],
          p2: ['note'],
        },
        solvedPuzzles: ['teddyPuzzle'],
        flags: {
          doorUnlocked: true,
        },
        playTimeSeconds: 180,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toContain('Progreso guardado');
    expect(response.body.progress.scene).toBe('SceneP1');
    expect(response.body.progress.flags.doorUnlocked).toBe(true);
  });

  it('recupera progreso guardado con usuario autenticado', async () => {
    const cookies = await createUserAndLogin();

    await request(app)
      .post('/api/progress')
      .set('Cookie', cookies)
      .send({
        slot: 'main',
        scene: 'SceneP1',
        players: {
          p1: { x: 120, y: 300 },
          p2: { x: 500, y: 300 },
        },
        inventory: {
          p1: ['teddy'],
          p2: ['note'],
        },
        solvedPuzzles: ['teddyPuzzle'],
        flags: {
          doorUnlocked: true,
        },
        playTimeSeconds: 180,
      });

    const response = await request(app)
      .get('/api/progress')
      .set('Cookie', cookies);

    expect(response.status).toBe(200);
    expect(response.body.progress.scene).toBe('SceneP1');
    expect(response.body.progress.inventory.p1).toContain('teddy');
    expect(response.body.progress.solvedPuzzles).toContain('teddyPuzzle');
    expect(response.body.progress.flags.doorUnlocked).toBe(true);
  });
});