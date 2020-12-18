import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import { Logger } from '@overnightjs/logger';
import FlowerStandServer from './FlowerStandServer';

createConnection().then(async (conn: Connection): Promise<void> => {
  const server: FlowerStandServer = new FlowerStandServer();
  server.start(3000);
}).catch((err: any) => {
  Logger.Err(err, true);
});
