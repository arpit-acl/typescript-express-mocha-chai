/* eslint @typescript-eslint/no-var-requires: "off" */

const log = require('log-to-file');
import moment from 'moment';
import fs from 'fs';
import constants from '../config/constants';

const errorDir = constants.DEFAULT_LOG_DIR;

const today = () => {
  return moment().format('YYYY-MM-DD');
};
const Logger = (message: any, deafaultLog: string) => {
  // get log types
  const logTypes = Object.values(constants.LOG_TYPE);
  // check if log type is valid or not
  if (!logTypes.includes(deafaultLog)) {
    return new Error('invalid log type');
  }

  const date = today();
  // created logs directory
  const logDir = errorDir + '/' + deafaultLog;

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, {
      recursive: true,
    });
  }
  // created directory accoriding log
  const errorDirPath = logDir + '/' + deafaultLog + '-' + date + '.log';
  log(message, errorDirPath);
  console.log(message);
};

export const info =(msg: any) => Logger(msg, 'info');
export const error = (msg: any) => Logger(msg, 'error');
export const debug = (msg: any) => Logger(msg, 'debug');
export const cron = (msg: any) => Logger(msg, 'cron');
export const webhook = (msg: any) => Logger(msg, 'webhook');
export const warn = (msg: any) => Logger(msg, 'warning');
export const contractLog = (msg: any) => Logger(msg, 'contractLog');
