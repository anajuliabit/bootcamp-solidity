import app from '@server';
import logger from '@shared/Logger';
import './pre-start'; // Must be the first import
import { StorageService } from './services/storage.service';

const port = Number(process.env.PORT || 3000);
export const storage = new StorageService();

const init = async () => {
    await storage.init();
    await app.listen(port);
}

init().then(() => logger.info('Express server started on port: ' + port));