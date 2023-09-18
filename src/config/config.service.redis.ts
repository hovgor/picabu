import { createClient } from 'redis';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
dotenv.config();

export const client = createClient({
  socket: {
    port: +process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
  password: process.env.REDIS_PASSWORD,
});

client.on('connect', () => {
  client.select(8);

  Logger.log('Connected to Redis');
});

client.on('error', (err) => {
  Logger.log('Redis Client Error', err);
  process.exit();
});

client.connect();
