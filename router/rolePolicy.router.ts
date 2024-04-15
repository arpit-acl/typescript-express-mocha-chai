import express from 'express';
import controller from '../controller/role.controller';
import permission from '../middleware/permission';

const policyRouter = express.Router();

policyRouter.use(permission('policy'));
policyRouter.post('/',  controller.create); 
policyRouter.put('/', controller.update);
policyRouter.delete('/', controller.remove); 
policyRouter.get('/', controller.list);
policyRouter.get('/:id', controller.details);

export default policyRouter;