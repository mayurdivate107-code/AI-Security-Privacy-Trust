import { Router } from 'express';
import { NotificationsController } from './notifications.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';

export const notificationsRouter = Router();

notificationsRouter.use(requireAuth);

notificationsRouter.get('/', NotificationsController.listNotifications);
notificationsRouter.patch('/read-all', NotificationsController.markAllRead);
notificationsRouter.patch('/:id/read', NotificationsController.markRead);
notificationsRouter.delete('/:id', NotificationsController.deleteNotification);
