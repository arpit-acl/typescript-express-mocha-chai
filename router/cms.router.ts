import express from 'express';
import cmsController from '../controller/cms.controller';
import requestValidator from '../middleware/request.validator';

const cmsRouter = express.Router();

cmsRouter.post('/', requestValidator(signupValidation), cmsController.create); 
cmsRouter.put('/', requestValidator(loginValidation), cmsController.update);
cmsRouter.delete('/', requestValidator(signupValidation), cmsController.delete); 
cmsRouter.get('/', requestValidator(loginValidation), cmsController.list);
cmsRouter.get('/:id', requestValidator(loginValidation), cmsController.details);

export default cmsRouter;