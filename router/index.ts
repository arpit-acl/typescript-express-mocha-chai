import express from 'express';
import authRouter from './auth.router';
import userRouter from './user.router';
import roleRouter from './role.router';
import deviceRouter from './devices.router';
import policyRouter from './rolePolicy.router';
import moduleRouter from './module.router'
import tokenValidator from '../middleware/token.validator';
import Permission from '../middleware/permission';

const indexRouter = express.Router();

indexRouter.use('/auth', authRouter);

indexRouter.use(tokenValidator.tokenValidate());
indexRouter.use(Permission());
indexRouter.use('/user', userRouter);
indexRouter.use('/role', roleRouter);
indexRouter.use('/device', deviceRouter);
indexRouter.use('/policy', policyRouter);
indexRouter.use('/modules', moduleRouter);

export default indexRouter;
