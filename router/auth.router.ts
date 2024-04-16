import express from 'express';
import authController from '../controller/auth.controller';
import requestValidator from '../middleware/request.validator';
import {signupValidation} from '../validation/auth.validation';

const authRouter = express.Router();

authRouter.post('/signup', requestValidator(signupValidation, ), authController.signup); 
authRouter.post('/login',  authController.login);

export default authRouter;