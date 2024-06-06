import axios from 'axios';
import { Ticketm } from '../models/Ticketm.js';

const API_KEY = 'KL3AnrgK3UfgzmIN687yrJQSBTkdHK1A';
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';

export const searchEventsByCityAndDate = async (city, startDate, endDate) => {
    const url = `${BASE_URL}?city=${encodeURIComponent(city)}&startDateTime=${startDate.toISOString()}&endDateTime=${endDate.toISOString()}&apikey=${API_KEY}`;
    
    try {
        const response = await axios.get(url);
       
        if (response.data._embedded && response.data._embedded.events) {
            return response.data._embedded.events;
        }
        return [];  
    } catch (error) {
        console.error('Error fetching events from Ticketmaster:', error.message);
        throw error;  
    }
};

export default searchEventsByCityAndDate;
