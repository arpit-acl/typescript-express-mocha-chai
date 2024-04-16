import express from 'express';
import controller from '../controller/policy.controller';

const router = express.Router();

router.post('/',  controller.create); 
router.put('/', controller.update);
router.delete('/', controller.remove); 
router.get('/', controller.list);
router.get('/:id', controller.details);

export default router;