import express from 'express';
import * as accomController from '../controllers/accomController.js';

const router = express.Router();

router.get('/', accomController.findAccommodations);
router.post('/', accomController.createAccommodation);

export default router;