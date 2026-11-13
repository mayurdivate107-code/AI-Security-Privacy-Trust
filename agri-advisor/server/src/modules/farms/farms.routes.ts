import { Router } from 'express';
import { FarmsController } from './farms.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import { CreateFarmSchema, UpdateFarmSchema } from './farms.schema.js';

export const farmsRouter = Router();

farmsRouter.use(requireAuth);

farmsRouter.get('/', FarmsController.listFarms);
farmsRouter.post('/', validateRequest({ body: CreateFarmSchema }), FarmsController.createFarm);
farmsRouter.get('/:id', FarmsController.getFarm);
farmsRouter.patch('/:id', validateRequest({ body: UpdateFarmSchema }), FarmsController.updateFarm);
farmsRouter.delete('/:id', FarmsController.deleteFarm);
