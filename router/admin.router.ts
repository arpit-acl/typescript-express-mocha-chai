import express from 'express';
import adminController from '../controller/admin.controller';

const adminRouter = express.Router();

adminRouter.post('/signup', requestValidator(signupValidation), authController.signupController); 
adminRouter.post('/login-wallet', requestValidator(loginValidation), authController.loginWallet);


export default adminRouter;