import axios from 'axios';

const API_KEY = 'c2ff5dcfd254658cd22d35f43e06fa89a42a7396ce96588aaab08c60f01cc82f'; 
const GOOGLE_HOTELS_API_URL = 'https://serpapi.com/search';

async function searchAccommodations(city, checkInDate, checkOutDate) {
    const params = {
        engine: 'google_hotels',
        q: city,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        api_key: API_KEY
    };

    try {
        const response = await axios.get(GOOGLE_HOTELS_API_URL, { params });
        return response.data.properties; 
    } catch (error) {
        console.error('Error fetching accommodations:', error.message);
        return [];
    }
}

export { searchAccommodations };
