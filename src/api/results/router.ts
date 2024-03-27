import express from 'express';
import { getHandle } from './get/handle';

// eslint-disable-next-line new-cap
const router = express.Router();

/**
 * Opens a existing Survey
 */

router.get('/get', getHandle());


export { router as resultsRoutes };
