import { Flight } from '../models/Flight.js';

export const getTrips = async (req, res) => {
  try {
    const trips = await Trip.findAll({ where: { userId: req.user.id } });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const createTrip = async (req, res) => {
  const { destination, startDate, endDate, comment } = req.body;
  if (!destination || !startDate || !endDate) {
    return res.status(400).json({ message: 'Destination, start date, and end date are required' });
  }

  try {
    const trip = await Trip.create({ destination, startDate, endDate, comment, userId: req.user.id });
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const updateTrip = async (req, res) => {
  const { destination, startDate, endDate, comment } = req.body;
  try {
    const trip = await Trip.update({ destination, startDate, endDate, comment }, { where: { id: req.params.id } });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    await Trip.destroy({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
