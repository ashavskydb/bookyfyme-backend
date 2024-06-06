import { Router } from 'express';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../controllers/calendarController.js';

const eventRouter = Router();

eventRouter.get('/', getEvents);
eventRouter.post('/', createEvent);
eventRouter.put('/:id', updateEvent);
eventRouter.delete('/:id', deleteEvent);

export default eventRouter;