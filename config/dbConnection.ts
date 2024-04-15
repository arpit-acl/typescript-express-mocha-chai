import mongoose from 'mongoose';
import {config} from './config';
import { info, error } from './logger';

class dbConnection {
  connection: object = {};
  constructor() {
    mongoose.set('strictQuery', false);
    this.connection = mongoose
      .connect(`${config.DB_CONNECTION}/${config.DATABASE}`, {})
      .then(() => {
        info(`Database connected successfully!`);
        return true;
      })
      .catch((err) => {
        error(`Db Connection Error : ${err}`);
        return false;
      });
  }

  async dbConnectionOpen() {
    return mongoose.connect(`${config.DB_CONNECTION}/${config.DATABASE}`).then(d => true).catch(d=>  false);
  }

  dbConnectionClose() {
    mongoose.connection.close();
  }
}

export default new dbConnection();
