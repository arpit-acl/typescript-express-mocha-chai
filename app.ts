import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import {config} from './config/config';
import dbConnection from './config/dbConnection';
import routers from './router';
import { info } from './config/logger';
import cronIndex from './jobs/index';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(routers);
app.use((req: any, res: any) => {
  res.send('Server Running');
});
/**
 * start server and all process
 */
export async function startServer() {
  if (dbConnection.connection) {
    app.listen(config.PORT, config.HOST, () => {
      info(`Server Listing At http://${config.HOST}:${config.PORT}`);
      new cronIndex();
    });
  } else {
    process.exit(0);
  }
  return app;
}