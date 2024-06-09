import axios from 'axios';
import { Flight } from '../../models/Flight.js';

const API_KEY = "c2ff5dcfd254658cd22d35f43e06fa89a42a7396ce96588aaab08c60f01cc82f";

async function searchFlights(origin, destination, departureDate, returnDate) {
  const response = await axios.get('https://serpapi.com/search', {
    params: {
      engine: 'google_flights',
      departure_id: origin,
      arrival_id: destination,
      outbound_date: departureDate,
      return_date: returnDate,
      api_key: API_KEY
    }
  });

  return response.data.best_flights || response.data.other_flights;
}

async function fetchFlightData() {
  const response = await axios.post(`https://travelimpactmodel.googleapis.com/v1/flights:computeFlightEmissions?key=${API_KEY}`, {
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      "flights": [
        {
          "origin": "ZRH",
          "destination": "CDG",
          "operatingCarrierCode": "AF",
          "flightNumber": 1115,
          "departureDate": { "year": 2024, "month": 12, "day": 2 }
        }
      ]
    }
  });

  return response.data.flightEmissions[0];
}

async function bookFlightAndCreateTrip() {
  const flightData = await fetchFlightData();

  const flight = await Flight.create({
    userId: 1,
    destination: flightData.flight.destination,
    startDate: new Date(flightData.flight.departureDate.year, flightData.flight.departureDate.month - 1, flightData.flight.departureDate.day),
    endDate: new Date(flightData.flight.departureDate.year, flightData.flight.departureDate.month - 1, flightData.flight.departureDate.day + 1), // Example: plus one day
    comment: 'Trip to ' + flightData.flight.destination
  });

  addFlightToCalendar(flight);
}

async function addFlightToCalendar(flight) {
  console.log(`Event added to calendar: Flight to ${flight.destination} from ${flight.startDate.toISOString()} to ${flight.endDate.toISOString()}`);
}

export { searchFlights, bookFlightAndCreateTrip, fetchFlightData };
