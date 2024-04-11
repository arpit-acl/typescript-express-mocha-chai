import timeLog from '@jobs/timeLog.cron';
import { CronJob } from 'cron';
import {config} from '../config/config';

class Jobs {
  timeLogCron: CronJob;

  constructor() {
    this.timeLogCron = new CronJob(config.CRONS.TIME_CRON, timeLog.init);  
    // start all cron jobs
    this.timeLogCron.start();
  }
}

export default Jobs;