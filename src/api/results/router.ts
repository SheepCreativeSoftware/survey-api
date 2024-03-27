import express from 'express';
import { getHandle } from './get/handle';

const router = express.Router();

/**
 * Opens a existing Survey
 */

router.get('/get', getHandle());

export { router as resultsRoutes };
