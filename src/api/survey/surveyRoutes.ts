import express from 'express';
import { getSurvey } from './get/handle';
import { removeHandle } from './remove/handle';
import { shareLinkHandle } from './share-link/handle';
import { submitHandle } from './submit/handle';
import { updateHandle } from './update/handle';

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/get', getSurvey());
router.get('/share-link', shareLinkHandle());
router.post('/submit', submitHandle());
router.post('/update', updateHandle());
router.post('/remove', removeHandle());

export { router as surveyRoutes };
