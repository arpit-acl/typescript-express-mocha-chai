import express from 'express';
import authController from '../controller/auth.controller';
import requestValidator from '../middleware/request.validator';
import { verfiyOtpValidation, signupValidation, loginValidation } from '../validation/auth.validation';

const authRouter = express.Router();

// authentication apis
authRouter.post('/signup', requestValidator(signupValidation), authController.signup); 
authRouter.post('/login', requestValidator(loginValidation), authController.login);

export default authRouter;