import express from 'express';
import authRouter from './auth.router';
import userRouter from './user.router';
import cmsRouter from './cms.router';
import roleRouter from './role.router';

const indexRouter = express.Router();

indexRouter.use('/auth', authRouter);
indexRouter.use('/user', userRouter);
indexRouter.use('/role', roleRouter);
indexRouter.use('/cms', cmsRouter);

export default indexRouter;
