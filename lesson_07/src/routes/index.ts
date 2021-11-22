import { Router } from 'express';
import { addData, get } from './storage.controller';

const router = Router();
router.get('/:cid', get);
router.post('/', addData);

const baseRouter = Router();
baseRouter.use('/ipfs', router);
export default baseRouter;
