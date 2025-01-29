import { describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { app } from '../index';
import { prisma } from '../libs/__mocks__/prisma';
import { RequestMethodEnum } from '@prisma/client';

// * add mocking
// vi.mock('../libs/prisma', () => ({
//   prisma: { request: { create: () => {} } },
// }));

// * deep mocking
vi.mock('../libs/prisma');

describe('POST /sum', () => {
  it('should return the sum of two numbers', async () => {
    prisma.request.create.mockResolvedValue({
      id: 1,
      a: 1,
      b: 2,
      answer: 3,
      method: RequestMethodEnum.Sum,
    });

    vi.spyOn(prisma.request, 'create');

    const res = await request(app).post('/sum').send({
      a: 1,
      b: 2,
    });

    expect(prisma.request.create).toHaveBeenCalledWith({
      data: {
        a: 1,
        b: 2,
        answer: 3,
        method: RequestMethodEnum.Sum,
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.answer).toBe(3);
    expect(res.body).toHaveProperty('id');
  });

  it('should return 411 if no inputs are provided', async () => {
    const res = await request(app).post('/sum').send({});
    expect(res.statusCode).toBe(411);
    expect(res.body.message).toBe('Incorrect inputs');
  });
});

describe('GET /sum', () => {
  it('should return the sum of two numbers', async () => {
    const res = await request(app)
      .get('/sum')
      .set({
        a: '1',
        b: '2',
      })
      .send();
    expect(res.statusCode).toBe(200);
    expect(res.body.answer).toBe(3);
  });

  it('should return 411 if no inputs are provided', async () => {
    const res = await request(app).get('/sum').send();
    expect(res.statusCode).toBe(411);
  });
});

describe('POST /multiply', () => {
  it('should return the product of two numbers', async () => {
    prisma.request.create.mockResolvedValue({
      id: 1,
      a: 1,
      b: 2,
      answer: 2,
      method: RequestMethodEnum.Multiply,
    });

    vi.spyOn(prisma.request, 'create');

    const res = await request(app).post('/multiply').send({
      a: 1,
      b: 2,
    });

    expect(prisma.request.create).toHaveBeenCalledWith({
      data: {
        a: 1,
        b: 2,
        answer: 2,
        method: RequestMethodEnum.Multiply,
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.answer).toBe(2);
    expect(res.body).toHaveProperty('id');
  });

  it('should return 411 if no inputs are provided', async () => {
    const res = await request(app).post('/multiply').send({});
    expect(res.statusCode).toBe(411);
  });
});
