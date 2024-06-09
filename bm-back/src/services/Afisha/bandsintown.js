import axios from 'axios';
import readline from 'readline';
import { Bandsintown } from '../../models/Bandsintown.js';
import { sequelize } from '../../database/db.js';    

async function httpGetAsync(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching data from API:', error);
        return null;
    }
}

async function parseEvent(artist, region) {
    const url = `https://rest.bandsintown.com/artists/${artist}/events?app_id=9c42d4dc9c1397201a4e3dc4d0bb840c&venue.region=${region}`;
    const data = await httpGetAsync(url);
    if (data) {
        const numEvents = data.length;
        console.log(`${numEvents} events found for ${artist}`);
        for (let j = 0; j < numEvents; j++) {
            if (data[j].venue.region === region) {
                console.log(`Venue: ${data[j].venue.name}`);
                console.log(`LAT: ${data[j].venue.latitude} LNG: ${data[j].venue.longitude}`);
                console.log(`ARTIST: ${data[j].artists[0].name}`);
                console.log(`DATE: ${data[j].datetime}`);
                console.log(`Region: ${data[j].venue.region}`);
                console.log(`Event ${j}`);
                console.log('---');

                await Bandsintown.create({
                    name: data[j].artists[0].name,
                    city: data[j].venue.city,
                    date: data[j].datetime.split('T')[0], 
                    details: `Venue: ${data[j].venue.name}, LAT: ${data[j].venue.latitude}, LNG: ${data[j].venue.longitude}`
                });
            }
        }
    }
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

const regions = [
    { name: 'California', code: 'CA' },
    { name: 'New York', code: 'NY' },
    { name: 'Texas', code: 'TX' },
    { name: 'Florida', code: 'FL' },
    { name: 'Illinois', code: 'IL' },
    { name: 'Pennsylvania', code: 'PA' },
    { name: 'Ohio', code: 'OH' },
    { name: 'Georgia', code: 'GA' },
    { name: 'North Carolina', code: 'NC' },
    { name: 'Michigan', code: 'MI' },
    { name: 'Moscow', code: 'MOW' },
    { name: 'Saint Petersburg', code: 'SPE' },
    { name: 'London', code: 'LND' },
    { name: 'Berlin', code: 'BER' },
    { name: 'Paris', code: 'PAR' },
    { name: 'Tokyo', code: 'TOK' },
    { name: 'Sydney', code: 'SYD' },
    { name: 'Toronto', code: 'TOR' }
];

function promptUserForRegion() {
    console.log('Please select a region:');
    regions.forEach((region, index) => {
        console.log(`${index + 1}. ${region.name}`);
    });

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter the number of your choice: ', (answer) => {
        const regionIndex = parseInt(answer) - 1;
        if (regionIndex >= 0 && regionIndex < regions.length) {
            const selectedRegion = regions[regionIndex].code;
            rl.close();
            startFetchingEvents(selectedRegion);
        } else {
            console.error('Invalid choice. Please try again.');
            rl.close();
            promptUserForRegion();
        }
    });
}

async function startFetchingEvents(region) {
    await sequelize.sync(); 
    for (let artist of artists) {
        await parseEvent(artist, region);
        console.log('---NEXT ARTIST---');
    }
}

promptUserForRegion(); 

export { parseEvent };