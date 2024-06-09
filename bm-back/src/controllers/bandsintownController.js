import { Bandsintown } from '../models/Bandsintown.js';

export const findEvents = async (req, res) => {
  try {
    const events = await Bandsintown.findAll({
      where: {
        city: req.params.city,
        date: req.query.date
      }
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const createEvent = async (req, res) => {
  try {
    const newEvent = await Bandsintown.create(req.body);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
