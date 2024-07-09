import { Event } from '../models/Event.js';

export const getEvents = async (req, res) => {
  console.log('getEvent req===>');
  console.log('getEvent res===>');
  try {
    const events = await Event.findAll({ where: { userId: req.user.id } });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error); // error logging
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const createEvent = async (req, res) => {
  const { title, description, eventDate } = req.body;
  if (!title || !eventDate) {
    return res.status(400).json({ message: 'Title and event date are required' });
  }

  try {
    const event = await Event.create({ title, description, eventDate, userId: req.user.id });
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error); // error logging
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateEvent = async (req, res) => {
  const { title, description, eventDate } = req.body;
  try {
    const event = await Event.update({ title, description, eventDate }, { where: { id: req.params.id } });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    await Event.destroy({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
