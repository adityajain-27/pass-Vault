import express from 'express';
import { strengthCheck, breachCheck } from '../controllers/utilsController.js';

const router = express.Router();
router.post('/strength', strengthCheck);
router.get('/breach-check', breachCheck);

export default router;