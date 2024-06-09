import express from 'express';
import * as bandsintownController from '../controllers/bandsintownController.js';

const router = express.Router();

router.get('/:city', bandsintownController.findEvents); 
router.post('/', bandsintownController.createEvent);

export default router;
