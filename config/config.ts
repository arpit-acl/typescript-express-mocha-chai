import dotenv from 'dotenv';
dotenv.config();
import { error } from '../config/logger';

export let config = <any>{
  PORT: 'PORT',
  HOST: 'HOST',
  DB_CONNECTION: 'DBCONNECT_URL',
  DATABASE: 'DBNAME',
  JWT_SECRET: 'JWT_SECRET',
  AUTH_ALGO: 'AUTH_ALGO',
  LOGO_URL: 'LOGO_URL',
  FRONT_URL: 'FRONT_URL',
  CRONS: {
    TIME_CRON: 'TIME_CRON',
  }
};
const catchConfig = {};
const updateObjProps = (obj: any, newObj: any, secretValues: any) => {
  for (const key in newObj) {
    if (newObj[key]?.constructor?.name === {}.constructor.name) {
      obj[key] = obj[key] ?? {};
      updateObjProps(obj[key], newObj[key], secretValues);
      continue;
    }
    obj[key] = secretValues[newObj[key]];
  }
};

export const loadConfig = async function () { 
  try {
    const data = process.env;
    if (data) {
      const configObj = data;
      updateObjProps(catchConfig, config, configObj);
      config = {
        ...catchConfig
      };
      if (process.env.NODE_ENV === 'development') {
        config.HOST = 'localhost';
      }
    }
  } catch (err) {
    error(`Error in getting AWS_SM configuration ${err}`);
    process.exit();
  }
};