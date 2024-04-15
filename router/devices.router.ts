import express from 'express';
import authController from '../controller/auth.controller';
import requestValidator from '../middleware/request.validator';

const deviceRouter = express.Router();


export default deviceRouter;