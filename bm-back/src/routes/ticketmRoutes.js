import express from 'express';
import * as ticketmController from '../controllers/ticketmController.js';

const router = express.Router();

router.get('/:city', ticketmController.findEvents); 
router.post('/', ticketmController.createEvent);

export default router;
