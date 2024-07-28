import axios from 'axios';
import { Bandsintown } from '../../models/Bandsintown.js';
import { sequelize } from '../../database/db.js';

const apiUrl = 'http://localhost:5000/api/bandsintown';

async function httpGetAsync(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching data from API:', error.response ? error.response.data : error.message);
        return null;
    }
}

async function createEventOnServer(eventData) {
    try {
        const response = await axios.post(`${apiUrl}/`, eventData);
        return response.data;
    } catch (error) {
        console.error('Error creating event on server:', error.response ? error.response.data : error.message);
        return null;
    }
}

async function saveEventToDatabase(eventData) {
    try {
        const event = await Bandsintown.create(eventData);
        return event;
    } catch (error) {
        console.error('Error saving event to database:', error);
        return null;
    }
}

async function parseEvent(artist, region) {
    const url = `https://rest.bandsintown.com/artists/${artist}/events?app_id=9c42d4dc9c1397201a4e3dc4d0bb840c&venue.region=${region}`;
    const data = await httpGetAsync(url);
    const events = [];
    
    if (data) {
        const numEvents = data.length;
        console.log(`${numEvents} events found for ${artist}`);
        for (let j = 0; j < numEvents; j++) {
            if (data[j].venue.region === region) {
                const event = data[j];
                const eventArtist = event.artists && event.artists[0];
                if (eventArtist) {
                    console.log(`Venue: ${event.venue.name}`);
                    console.log(`LAT: ${event.venue.latitude} LNG: ${event.venue.longitude}`);
                    console.log(`ARTIST: ${eventArtist.name}`);
                    console.log(`DATE: ${event.datetime}`);
                    console.log(`Region: ${event.venue.region}`);
                    console.log(`Event ${j}`);
                    console.log('---');

                    const eventData = {
                        name: eventArtist.name,
                        city: event.venue.city,
                        date: event.datetime.split('T')[0],
                        details: `Venue: ${event.venue.name}, LAT: ${event.venue.latitude}, LNG: ${event.venue.longitude}`
                    };

                    events.push(eventData);

                    await createEventOnServer(eventData);
                    await saveEventToDatabase(eventData);
                } else {
                    console.warn(`No artists found for event ${j}`);
                }
            }
        }
    }
    return events;
}

const artists = [
    "Twenty One Pilots", "Atmosphere", "Vince Staples", "STRFKR", "Rainbow Kitten Surprise",
    "Mac Demarco", "Hippo Campus", "Drake", "John Legend", "Rihanna", "Flying Lotus",
    "MGMT", "Jason Derulo", "M83", "Bon Iver", "Childish Gambino", "The Del McCoury Band", "Dawes",
    "Adele", "Ariana Grande", "Beyonce", "Billie Eilish", "Bruno Mars", "Camila Cabello",
    "Cardi B", "Dua Lipa", "Ed Sheeran", "Eminem", "Halsey", "Harry Styles", "J Balvin",
    "Justin Bieber", "Katy Perry", "Khalid", "Lady Gaga", "Lana Del Rey", "Lil Nas X",
    "Lizzo", "Maroon 5", "Post Malone", "Shawn Mendes", "Taylor Swift", "The Weeknd",
    "Travis Scott", "Sam Smith", "Selena Gomez", "SZA", "Tame Impala", "Tyler, The Creator",
    "Zayn", "Florence + The Machine", "Imagine Dragons", "Kendrick Lamar", "Lorde",
    "Meghan Trainor", "Panic! At The Disco", "Paramore", "The Chainsmokers", "The Strokes",
    "Vampire Weekend", "The Killers", "Red Hot Chili Peppers", "Gorillaz", "Coldplay",
    "Foo Fighters", "Green Day", "Kings of Leon", "Linkin Park", "Metallica", "Muse",
    "Nirvana", "Pearl Jam", "Radiohead", "Rage Against The Machine", "System Of A Down",
    "U2", "Arctic Monkeys", "Beck", "Blur", "The Cure", "Depeche Mode", "New Order",
    "Nine Inch Nails", "Oasis", "Pixies", "Smashing Pumpkins", "Stone Roses", "The Verve",
    "Blink-182", "Fall Out Boy", "Good Charlotte", "My Chemical Romance", "Simple Plan",
    "Sum 41", "Yellowcard", "3 Doors Down", "30 Seconds to Mars", "AFI", "All Time Low"
];

export async function fetchEvents(region) {
    await sequelize.sync();
    const allEvents = [];

    for (let artist of artists) {
        const events = await parseEvent(artist, region);
        allEvents.push(...events);
        console.log('---NEXT ARTIST---');
    }

    return allEvents;
}

export { parseEvent };