import { error, info } from './config/logger';
import {loadConfig} from './config/config';
import seedData from './config/seeds';
import dbConnection from './config/dbConnection';

(async () => {
  await loadConfig().then(async () => {
    const dbStatus = await dbConnection.dbConnectionOpen();
    if ( dbStatus ) {
      info('Db connected successfully');
      await seedData();
      const {startServer} = await import('./app');
      await startServer();  
    } else {
      process.exit(0);
    }
  }
  ).catch((err : Error) => {
    error(`Error: ${err?.message}`);
    process.exit(0);
  });
})();
