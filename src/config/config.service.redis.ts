import { createClient } from 'redis';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
dotenv.config();

export const client = createClient({
  socket: {
    port: +process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
});

client.on('connect', () => {
  switch (process.env.NODE_ENV) {
    case 'local':
      client.select(0);
      break;
    case 'development':
      client.select(1);
      break;
    case 'staging':
      client.select(2);
      break;
    case 'production':
      client.select(3);
      break;
  }
  Logger.log('Connected to Redis');
});

client.on('error', (err) => {
  Logger.log('Redis Client Error', err);
  process.exit();
});

client.connect();
