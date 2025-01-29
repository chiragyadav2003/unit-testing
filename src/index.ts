import express from 'express';
import { z } from 'zod';
import { prisma } from './libs/prisma';
import { RequestMethodEnum } from '@prisma/client';

export const app = express();
app.use(express.json());

const inputSchema = z.object({
  a: z.number(),
  b: z.number(),
});

app.post('/sum', async (req, res) => {
  const parsedResponse = inputSchema.safeParse(req.body);

  if (!parsedResponse.success) {
    res.status(411).json({ message: 'Incorrect inputs' });
    return;
  }

  const answer = parsedResponse.data.a + parsedResponse.data.b;

  const data = await prisma.request.create({
    data: {
      a: parsedResponse.data.a,
      b: parsedResponse.data.b,
      answer,
      method: RequestMethodEnum.Sum,
    },
  });

  res.json({ answer, id: data.id });
});

app.get('/sum', (req, res) => {
  const parsedResponse = inputSchema.safeParse({
    a: Number(req.headers['a']),
    b: Number(req.headers['b']),
  });

  if (!parsedResponse.success) {
    res.status(411).json({ message: 'Incorrect inputs' });
    return;
  }

  const answer = parsedResponse.data.a + parsedResponse.data.b;

  res.json({ answer });
});

app.post('/multiply', async (req, res) => {
  const parsedResponse = inputSchema.safeParse(req.body);

  if (!parsedResponse.success) {
    res.status(411).json({ message: 'Incorrect inputs' });
    return;
  }

  const answer = parsedResponse.data.a * parsedResponse.data.b;

  const data = await prisma.request.create({
    data: {
      a: parsedResponse.data.a,
      b: parsedResponse.data.b,
      answer,
      method: RequestMethodEnum.Multiply,
    },
  });

  res.json({ answer, id: data.id });
});
