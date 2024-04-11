import express from 'express';
import roleController from '../controller/role.controller';
import requestValidator from '../middleware/request.validator';

const roleRouter = express.Router();

roleRouter.post('/', requestValidator(signupValidation), roleController.CreateRole); 
roleRouter.put('/', requestValidator(loginValidation), roleController.UpdateRole);
roleRouter.delete('/', requestValidator(signupValidation), roleController.DeleteRole); 
roleRouter.get('/', requestValidator(loginValidation), roleController.RoleList);
roleRouter.get('/:id', requestValidator(loginValidation), roleController.RoleDetails);

export default roleRouter;