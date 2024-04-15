import express from 'express';
import controller from '../controller/role.controller';
import permission from '../middleware/permission';

const roleRouter = express.Router();

roleRouter.use(permission('role'));
roleRouter.post('/',  controller.create); 
roleRouter.put('/', controller.update);
roleRouter.delete('/', controller.remove); 
roleRouter.get('/', controller.list);
roleRouter.get('/:id', controller.details);

export default roleRouter;