import { searchAccommodations } from '../services/Accommodations/googleHotels.js';
import { Accommodation } from '../models/Accommodation.js';

export const findAccommodations = async (req, res) => {
  try {
    const { city, startDate, endDate } = req.query;
    if (!city || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required parameters" });
    }
    const accommodations = await searchAccommodations(city, startDate, endDate);
    res.json(accommodations);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const createAccommodation = async (req, res) => {
  try {
    const { city, startDate, endDate, listingDetails } = req.body;
    if (!city || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const newAccommodation = await Accommodation.create({ city, startDate, endDate, listingDetails });
    res.status(201).json(newAccommodation);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
