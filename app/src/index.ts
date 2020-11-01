import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import FlowerStandServer from './FlowerStandServer';

createConnection().then(async (conn: Connection): Promise<void> => {
  const server: FlowerStandServer = new FlowerStandServer();
  server.start(3000);
}).catch((err: any) => {
  console.log(err);
});
