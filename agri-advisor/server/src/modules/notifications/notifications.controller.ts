import { Response } from 'express';
import { AuthenticatedRequest } from '../../types/index.js';
import { NotificationsService } from './notifications.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export class NotificationsController {
  public static async listNotifications(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const data = await NotificationsService.listNotifications(req.user!.id);
      sendSuccess(res, data, 'Notifications retrieved successfully');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  public static async markRead(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const data = await NotificationsService.markAsRead(req.params.id, req.user!.id);
      sendSuccess(res, data, 'Notification marked as read');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async markAllRead(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      await NotificationsService.markAllAsRead(req.user!.id);
      sendSuccess(res, null, 'All notifications marked as read');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async deleteNotification(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      await NotificationsService.deleteNotification(req.params.id, req.user!.id);
      sendSuccess(res, null, 'Notification deleted successfully');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }
}
