import { Router } from 'express';
import { PublicAdmissionsController } from './publicController.js';

export const publicAdmissionsRouter = Router();
const controller = new PublicAdmissionsController();

// Unauthenticated public endpoints
publicAdmissionsRouter.post('/submit', (req, res, next) => controller.submitPublicApplication(req, res, next));
publicAdmissionsRouter.post('/track', (req, res, next) => controller.trackApplication(req, res, next));
