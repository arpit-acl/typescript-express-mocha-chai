import mongoose from 'mongoose';
import {config} from './config';
import { info, error } from './logger';

class dbConnection {

  async dbConnectionOpen() {
    mongoose.set('strictQuery', false);
    return mongoose.connect(`${config.DB_CONNECTION}/${config.DATABASE}`).then(d => true).catch(d=>  false);
  }

  dbConnectionClose() {
    mongoose.connection.close();
  }
}

export default new dbConnection();
