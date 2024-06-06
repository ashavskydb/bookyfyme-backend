const axios = require('axios');
const { Trip } = require('./models/Trip'); 

async function fetchFlightData() {
  const API_KEY = "AIzaSyAEUOrTX1RtMJ9vVgqgevhRlGyIYrNw2DA";
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
          "departureDate": {"year": 2024, "month": 12, "day": 2}
        }
      ]
    }
  });

  return response.data.flightEmissions[0]; 
}

async function bookFlightAndCreateTrip() {
  const flightData = await fetchFlightData();

  
  const trip = await Trip.create({
    userId: 1, 
    destination: flightData.flight.destination,
    startDate: new Date(flightData.flight.departureDate.year, flightData.flight.departureDate.month - 1, flightData.flight.departureDate.day),
    endDate: new Date(flightData.flight.departureDate.year, flightData.flight.departureDate.month - 1, flightData.flight.departureDate.day + 1), // Пример: плюс один день
    comment: 'Путешествие в ' + flightData.flight.destination
  });

  addEventToCronofy(trip);
}

async function addEventToCronofy(trip) {
  const { cronofyClient } = require('./cronofySetup'); 

  const event = {
    event_id: `trip-${trip.id}`,
    summary: 'Полет в ' + trip.destination,
    description: trip.comment,
    start: trip.startDate.toISOString(),
    end: trip.endDate.toISOString(),
    tzid: 'Etc/UTC'
  };

  await cronofyClient.createEvent({
    calendar_id: 'your_calendar_id', 
    event
  });
}

bookFlightAndCreateTrip();