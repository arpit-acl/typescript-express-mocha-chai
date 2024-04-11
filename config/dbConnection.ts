import mongoose from 'mongoose';
import {config} from './config';
import { info, error } from './logger';

class dbConnection {
  connection: object = {};
  constructor() {
    mongoose.set('strictQuery', false);
    console.log(`${config.DB_CONNECTION}/${config.DATABASE}`);
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

  dbConnectionOpen() {
    mongoose.connect(`${config.DB_CONNECTION}/${config.DATABASE}`);
  }

  dbConnectionClose() {
    mongoose.connection.close();
  }
}

export default new dbConnection();
