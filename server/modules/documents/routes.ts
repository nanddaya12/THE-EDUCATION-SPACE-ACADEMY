import { Router } from 'express';
import { DocumentController } from './documentController.js';
import { authenticate } from '../../core/middleware/authMiddleware.js';

export const documentRouter = Router();
export const publicCertificateRouter = Router();

const controller = new DocumentController();

documentRouter.get('/status', (req, res) => res.json({ success: true, module: 'documents', initialized: true }));

// Student Documents
documentRouter.get('/student/:studentId', authenticate, (req, res, next) =>
  controller.getStudentDocuments(req, res, next)
);

documentRouter.post('/student/:studentId', authenticate, (req, res, next) =>
  controller.uploadStudentDocument(req, res, next)
);

// Staff Documents
documentRouter.get('/staff/:staffId', authenticate, (req, res, next) =>
  controller.getStaffDocuments(req, res, next)
);

documentRouter.post('/staff/:staffId', authenticate, (req, res, next) =>
  controller.uploadStaffDocument(req, res, next)
);

// Private Document File Download (Guarded by Authorization Checks)
documentRouter.get('/:documentId/download', authenticate, (req, res, next) =>
  controller.downloadPrivateDocument(req, res, next)
);

// Certificate Templates & Management
documentRouter.get('/certificates/templates', authenticate, (req, res, next) =>
  controller.getCertificateTemplates(req, res, next)
);

documentRouter.get('/certificates', authenticate, (req, res, next) =>
  controller.getCertificates(req, res, next)
);

documentRouter.post('/certificates/issue', authenticate, (req, res, next) =>
  controller.issueCertificate(req, res, next)
);

documentRouter.put('/certificates/:serialNumber/revoke', authenticate, (req, res, next) =>
  controller.revokeCertificate(req, res, next)
);

// Public QR Code Verification Endpoint (No Auth Required for Scanner Verification)
publicCertificateRouter.get('/verify/:serialNumber', (req, res, next) =>
  controller.verifyCertificatePublic(req, res, next)
);
