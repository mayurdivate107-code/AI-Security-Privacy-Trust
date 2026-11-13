import { Router } from 'express';
import { KnowledgeController } from './knowledge.controller.js';

export const knowledgeRouter = Router();

knowledgeRouter.get('/', KnowledgeController.listArticles);
knowledgeRouter.get('/:slug', KnowledgeController.getArticle);
