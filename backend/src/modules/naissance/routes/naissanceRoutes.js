import express from 'express';
import { createNaissance, getNaissance, verifyNaissance, getAgentStats, syncBlockchain } from '../controllers/naissanceController.js';

const router = express.Router();

router.post('/', createNaissance);
router.post('/system/sync-blockchain', syncBlockchain);
router.get('/', getDeclarations);
router.get('/:id', getNaissance);
router.post('/:id/approve', approveDeclaration);
router.post('/:id/reject', rejectDeclaration);
router.get('/verify/:id', verifyNaissance);
router.get('/stats/:agentId', getAgentStats);

export default router;
