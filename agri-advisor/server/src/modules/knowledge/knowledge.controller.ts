import { Request, Response } from 'express';
import { KnowledgeService } from './knowledge.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export class KnowledgeController {
  public static async listArticles(req: Request, res: Response): Promise<void> {
    try {
      const category = req.query.category as string | undefined;
      const data = await KnowledgeService.listArticles(category);
      sendSuccess(res, data, 'Knowledge articles retrieved successfully');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  public static async getArticle(req: Request, res: Response): Promise<void> {
    try {
      const data = await KnowledgeService.getArticleBySlug(req.params.slug);
      if (!data) {
        sendError(res, 'Article not found', 404, 'NOT_FOUND');
        return;
      }
      sendSuccess(res, data, 'Article retrieved successfully');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }
}
