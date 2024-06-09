import { Accommodation } from '../models/Accommodation.js';

export const findAccommodations = async (req, res) => {
  try {
    const accommodations = await Accommodation.findAll({
      where: {
        city: req.params.city,
        startDate: req.query.startDate,
        endDate: req.query.endDate
      }
    });
    res.json(accommodations);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const createAccommodation = async (req, res) => {
  try {
    const newAccommodation = await Accommodation.create(req.body);
    res.status(201).json(newAccommodation);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
