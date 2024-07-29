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
    const url = `https://rest.bandsintown.com/artists/${artist}/events?app_id=9c42d4dc9c1397201a4e3dc4d0bb840c&venue.city=${city}`;
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
                    console.log(`City: ${event.venue.city}`);
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
    "Sum 41", "Yellowcard", "3 Doors Down", "30 Seconds to Mars", "AFI", "All Time Low",
    "Morgan Wallen", "Olivia Rodrigo", "Doja Cat", "Kanye West", "BTS", "J Cole", "Bad Bunny", 
    "Future", "Lil Baby", "Megan Thee Stallion", "Luke Combs", "H.E.R.", "Machine Gun Kelly", 
    "Juice WRLD", "Roddy Ricch", "DaBaby", "Karol G", "Rosalía", "Anitta", "Maluma", 
    "Daddy Yankee", "Ozuna", "Shakira", "Rauw Alejandro", "Enrique Iglesias", "Ricky Martin", 
    "Nicky Jam", "Aventura", "Romeo Santos", "Cigarettes After Sex", "Keane", "Def Leppard", "Robert Plant", "Volbeat", "Poets of the Fall",
    "The Weeknd", "SZA", "Bad Bunny", "Billie Eilish", "Post Malone", "Dua Lipa", "Ed Sheeran",
    "BTS", "Ariana Grande", "Harry Styles", "Maroon 5", "J. Cole", "Pop Smoke", "Luke Combs",
    "Travis Scott", "Megan Thee Stallion", "Cardi B", "Juice WRLD", "Kendrick Lamar",
    "Lana Del Rey", "Machine Gun Kelly", "YoungBoy Never Broke Again", "Shawn Mendes",
    "Chris Brown", "Imagine Dragons", "AJR", "Fleetwood Mac", "Elton John", "Rod Wave",
    "H.E.R.", "Michael Jackson", "Jack Harlow", "Polo G", "Zac Brown Band", "Giveon",
    "Glass Animals", "Halsey", "Luke Bryan", "Lil Durk", "DJ Khaled", "DaBaby", "Gabby Barrett",
    "NCT", "BLACKPINK", "Eric Church", "Justin Moore", "Blake Shelton", "Thomas Rhett",
    "Brett Young", "Pitbull", "Ava Max", "Megan Moroney", "Carly Pearce", "Jason Aldean",
    "Sam Smith", "Demi Lovato", "Dan + Shay", "Carrie Underwood", "Shania Twain", "Lil Tjay",
    "Summer Walker", "Camila Cabello", "Lewis Capaldi", "Daddy Yankee", "Ozuna", "Maluma",
    "Karol G", "Anuel AA", "J Balvin", "Becky G", "Ricky Martin", "Nicky Jam", "Alejandro Sanz",
    "Aventura", "Romeo Santos", "Farruko", "Pedro Capó", "Sebastián Yatra", "Reik",
    "Bad Gyal", "Rauw Alejandro", "Lunay", "Christian Nodal", "Banda MS", "Calibre 50",
    "Natanael Cano", "Grupo Firme", "Los Ángeles Azules", "Gerardo Ortiz", "Joss Favela",
    "Alejandro Fernández", "Camilo", "Manuel Turizo", "Mau y Ricky", "Pablo Alborán",
    "Melendi", "Beret", "Raphael", "David Bisbal", "Abraham Mateo", "Morat", "Greeicy",
    "TINI", "Kany García", "Carlos Vives", "Fonseca", "Juanes", "Andrés Cepeda", "Diego Torres",
    "Luciano Pereyra", "Amaia Montero", "Rosario", "Antonio Orozco", "Pastora Soler",
    "Vanesa Martín", "India Martínez", "Niña Pastori", "Pablo López", "Aitana", "Ana Mena",
    "Lola Indigo", "Rozalén", "Miki Núñez", "Cepeda", "Blas Cantó", "Bustamante", "Miriam Rodríguez",
    "Sergio Dalma", "Marta Sánchez", "David DeMaría", "Álex Ubago", "Antonio José", "Manuel Carrasco",
    "Joaquín Sabina", "Raphael", "José Luis Perales", "Armando Manzanero", "Juan Gabriel",
    "Marco Antonio Solís", "Vicente Fernández", "Pepe Aguilar", "Alejandro Fernández",
    "Chayanne", "Luis Miguel", "Julio Iglesias", "Ricardo Arjona", "Fito Páez", "Gustavo Cerati",
    "Charly García", "Andrés Calamaro", "Soda Stereo", "Los Fabulosos Cadillacs", "Manu Chao",
    "Enrique Bunbury", "Joaquín Sabina", "Vetusta Morla", "Izal", "Love of Lesbian", "Lori Meyers",
    "Dorian", "Second", "Supersubmarina", "La Habitación Roja", "Los Planetas", "Sidonie",
    "Miss Caffeina", "Varry Brava", "Fangoria", "La Casa Azul", "Hidrogenesse", "Joe Crepúsculo",
    "Javiera Mena", "La Bien Querida", "Zahara", "Anni B Sweet", "Russian Red", "Christina Rosenvinge",
    "Nacho Vegas", "Niño de Elche", "Kiko Veneno", "Soleá Morente", "Triángulo de Amor Bizarro",
    "El Columpio Asesino", "Belako", "Manel", "Els Amics de les Arts", "Rosalía", "Kali Uchis",
    "Sech", "Natti Natasha", "Myke Towers", "Zion & Lennox", "Arcángel", "De La Ghetto", "Jhay Cortez",
    "Gloria Trevi", "Yuridia", "Paty Cantú", "Mon Laferte", "Natalia Lafourcade", "Carla Morrison",
    "Sofía Reyes", "Danna Paola", "María José", "Kany García", "Lila Downs", "Ximena Sariñana",
    "Natalia Jiménez", "Ana Bárbara", "Chiquis", "La Adictiva Banda San José de Mesillas",
    "Banda Los Recoditos", "Banda MS", "Los Ángeles Azules", "Grupo Firme", "Calibre 50",
    "El Fantasma", "Gerardo Ortiz", "Julión Álvarez y su Norteño Banda", "Espinoza Paz",
    "Christian Nodal", "Bronco", "La Arrolladora Banda El Limón", "Lupillo Rivera",
    "Los Tucanes de Tijuana", "Pesado", "Intocable", "Los Tigres del Norte", "Joan Sebastian",
    "Kumbia Kings", "Selena", "RBD", "Rebelde", "Thalía", "Paulina Rubio", "Gloria Estefan",
    "Shakira", "Enrique Iglesias", "Ricky Martin", "Chayanne", "Luis Fonsi", "Marc Anthony",
    "Gilberto Santa Rosa", "Víctor Manuelle", "Olga Tañón", "Elvis Crespo", "Celia Cruz",
    "Tito Puente", "Willie Colón", "Rubén Blades", "Juan Luis Guerra", "Milly Quezada",
    "Sergio Vargas", "Eddy Herrera", "Toño Rosario", "Johnny Ventura", "Los Hermanos Rosario",
    "Shakira", "Carlos Vives", "ChocQuibTown", "Fonseca", "Greeicy", "Mike Bahía",
    "Jessi Uribe", "Paola Jara", "Silvestre Dangond", "Jorge Celedón", "Diomedes Díaz",
    "Martín Elías", "Jean Carlos Centeno", "Peter Manjarrés", "Binomio de Oro", "Jorge Oñate",
    "Alfredo Gutiérrez", "Iván Villazón", "Beto Zabaleta", "Los Diablitos", "El Binomio de Oro",
    "Hermanos Zuleta", "Los Betos", "Farid Ortiz", "Nelson Velásquez", "Hebert Vargas",
    "Los Gigantes del Vallenato", "Otto Serge", "Ivan Villazón", "La India", "Tito Rojas",
    "José Feliciano", "Manny Manuel", "Frankie Ruiz", "Héctor Lavoe", "Jerry Rivera", "Maelo Ruiz",
    "Luis Enrique", "Rocío Dúrcal", "Ana Gabriel", "Vicente Fernández", "Alejandro Fernández",
    "Pedro Infante", "Jorge Negrete", "Javier Solís", "Rocío Durcal", "Lupillo Rivera", "Jenni Rivera",
    "Banda El Recodo", "La Original Banda El Limón", "El Fantasma", "Ramón Ayala", "Los Rieleros del Norte",
    "Los Huracanes del Norte", "Los Invasores de Nuevo León", "Lalo Mora", "Lorenzo de Monteclaro",
    "Chalino Sánchez", "Adán 'Chalino' Sánchez", "Valentín Elizalde", "Tito Torbellino",
    "Ariel Camacho", "Kevin Ortiz", "Alfredo Olivas", "Régulo Caro", "Edwin Luna y La Trakalosa de Monterrey",
    "Banda Carnaval", "Banda Cuisillos", "Banda Rancho Viejo", "Banda Tierra Sagrada", "Banda La Ejecutiva",
    "Banda La Misma Tierra", "Banda Los Populares del Llano", "Banda Sinaloense MS de Sergio Lizárraga"
];


export async function fetchEvents(city) {
    await sequelize.sync();
    const allEvents = [];

    for (let artist of artists) {
        const events = await parseEvent(artist, city);
        allEvents.push(...events);
        console.log('---NEXT ARTIST---');
    }

    return allEvents;
}

export { parseEvent };
