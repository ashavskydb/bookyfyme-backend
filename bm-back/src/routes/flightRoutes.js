import { Router } from 'express';
import { getTrips, createTrip, updateTrip, deleteTrip } from '../controllers/flightController.js';

const tripRouter = Router();

tripRouter.get('/', getTrips);
tripRouter.post('/', createTrip);
tripRouter.put('/:id', updateTrip);
tripRouter.delete('/:id', deleteTrip);

export default tripRouter;
