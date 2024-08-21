import { searchAccommodations } from '../services/Accommodations/googleHotels.js';
import { Accommodation } from '../models/Accommodation.js';

export const findAccommodations = async (req, res) => {
  try {
    const { city, checkInDate, checkOutDate } = req.body;
    // console.log( city, checkInDate, checkOutDate);
    if (!city || !checkInDate || !checkOutDate) {
      return res.status(400).json({ error: "Missing required parameters" });
    }
    const accommodations = await searchAccommodations(city, checkInDate, checkOutDate);
    res.json(accommodations);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const createAccommodation = async (req, res) => {
  try {
    const { city, checkInDate, checkOutDate, listingDetails } = req.body;
    console.log( city, checkInDate, checkOutDate, listingDetails);
    if (!city || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const newAccommodation = await Accommodation.create({ city, startDate, endDate, listingDetails });
    console.log(newAccommodation);
    res.status(201).json(newAccommodation);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
