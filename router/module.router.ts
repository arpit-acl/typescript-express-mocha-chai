import express from 'express';
import controller from '../controller/module.controller';
import tokenValidator from '../middleware/token.validator';

const router = express.Router();


router.get('/list', controller.list);

export default router;