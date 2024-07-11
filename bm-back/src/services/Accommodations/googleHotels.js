import axios from 'axios';
import { Accommodation } from '../../models/Accommodation.js';

const API_KEY = 'c2ff5dcfd254658cd22d35f43e06fa89a42a7396ce96588aaab08c60f01cc82f'; 
const GOOGLE_HOTELS_API_URL = 'https://serpapi.com/search';

async function searchAccommodations(city, checkInDate, checkOutDate) {
  try {
    if (!city) {
      throw new Error('City parameter is required');
    }

    const response = await axios.get(GOOGLE_HOTELS_API_URL, {
      params: {
        engine: 'google_hotels',
        q: city,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        api_key: API_KEY
      }
    });

    console.log('Search Accommodations Response:', response.data);
    return response.data.properties;
  } catch (error) {
    console.error('Error fetching accommodations:', error.message);
    throw error;
  }
}

async function fetchAccommodationData(city, checkInDate, checkOutDate) {
  try {
    if (!city || !checkInDate || !checkOutDate) {
      throw new Error('All parameters (city, checkInDate, checkOutDate) are required');
    }

    const accommodations = await searchAccommodations(city, checkInDate, checkOutDate);
    if (!accommodations || accommodations.length === 0) {
      throw new Error('No accommodations found');
    }

    const accommodation = accommodations[0];
    return {
      city: accommodation.city,
      checkInDate: new Date(checkInDate),
      checkOutDate: new Date(checkOutDate),
      name: accommodation.name
    };
  } catch (error) {
    console.error('Error fetching accommodation data:', error.message);
    throw error;
  }
}

async function bookAccommodationAndCreateTrip() {
  try {
    const accommodationData = await fetchAccommodationData('Paris', '2024-12-02', '2024-12-05');
    
    const accommodation = await Accommodation.create({
      userId: 1, // Ensure you have the correct userId
      city: accommodationData.city,
      startDate: accommodationData.checkInDate,
      endDate: accommodationData.checkOutDate,
      listingDetails: 'Stay at ' + accommodationData.name
    });

    addAccommodationToCalendar(accommodation);
  } catch (error) {
    console.error('Error booking accommodation and creating trip:', error.message);
  }
}

async function addAccommodationToCalendar(accommodation) {
  console.log(`Event added to calendar: Stay at ${accommodation.city} from ${accommodation.startDate.toISOString()} to ${accommodation.endDate.toISOString()}`);
}

export { searchAccommodations, bookAccommodationAndCreateTrip, fetchAccommodationData };
