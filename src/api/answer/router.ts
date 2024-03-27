import express from 'express';
import { submitHandle } from './submit/handle';

const router = express.Router();

/**
 * Creates a new Survey which can be referenced to for options etc.
 */

router.post('/submit', submitHandle());

export { router as answerRoutes };
