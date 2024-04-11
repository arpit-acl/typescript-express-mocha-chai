import { error } from './config/logger';
import {loadConfig} from './config/config';

(async () => {
  await loadConfig().then(async () => {
    const {startServer} = await import('./app');
    await startServer();
  }
  ).catch((err : Error) => {
    error(`Error: ${err?.message}`);
  });
})();
