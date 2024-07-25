import express from 'express';
import cors from 'cors';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import router from './src/routes/users.js'; 
import eventRoutes from './src/routes/eventRoutes.js';
import tripRoutes from './src/routes/flightRoutes.js';
import accomRoutes from './src/routes/accomRoutes.js';
import bandsintownRoutes from './src/routes/bandsintownRoutes.js';
import verifyToken from './src/middleware/verifyToken.js';
import config from './src/config/config.js';
import { User } from './src/models/User.js';
import { searchFlights, bookFlightAndCreateTrip, fetchFlightData } from './src/services/Flights/googleFlights.js';
import { searchAccommodations } from './src/services/Accommodations/googleHotels.js';
import { parseEvent } from './src/services/Afisha/bandsintown.js';

dotenv.config();

const requiredEnvVars = ['PGHOST', 'PGDATABASE', 'PGUSER', 'PGPASSWORD', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars.join(', '));
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/api/auth', router);
app.use('/api/events', eventRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/accommodations', verifyToken, accomRoutes);
app.use('/api/accommodations', accomRoutes);
app.use('/api/bandsintown', bandsintownRoutes);

const calendars = [];

app.post('/api/flights/search', async (req, res) => {
    try {
        const { origin, destination, departureDate, returnDate } = req.body;
        console.log('Flight search parameters:', { origin, destination, departureDate, returnDate });
        const flights = await searchFlights(origin, destination, departureDate, returnDate);
        console.log('Flights found:', flights);
        res.status(200).json(flights);
    } catch (error) {
        console.error('Error during flight search:', error); 
        res.status(500).json({ error: 'Internal server error during flight search' });
    }
});

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'postgres', 
    dialectOptions: {
        ssl: {
            require: config.useSSL,
            rejectUnauthorized: config.rejectUnauthorized
        }
    },
    logging: config.logging
});

app.post('/api/create-calendar', (req, res) => {
    try {
        const { calendarName } = req.body;
        const newCalendar = {
            id: calendars.length + 1,
            name: calendarName,
            events: []
        };
        calendars.push(newCalendar);
        res.status(201).json(newCalendar);
    } catch (error) {
        console.error('Error creating calendar:', error);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
});

app.get('/api/calendars' , verifyToken, (req, res) => {
    try {
        res.status(200).json(calendars);
    } catch (error) {
        console.error('Error fetching calendars:', error);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
});

app.post('/api/book-flight' , verifyToken, async (req, res) => {
    try {
        const result = await bookFlightAndCreateTrip(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error booking flight:', error);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
});

app.post('/api/book-accommodation-and-find-events', verifyToken, async (req, res) => {
    try {
        const { city, startDate, endDate } = req.body;
        const accommodations = await searchAccommodations(city, startDate, endDate);

        const calendarEvent = {
            event_id: 'accommodation-' + new Date().getTime(),
            summary: 'Accommodation in ' + city,
            description: 'Accommodation booked from ' + startDate + ' to ' + endDate,
            start: startDate,
            end: endDate,
            tzid: 'Etc/UTC'
        };

        const defaultCalendar = calendars[0];
        defaultCalendar.events.push(calendarEvent);

        res.status(201).json({ accommodations, calendarEvent });
    } catch (error) {
        console.error('Error booking accommodation and finding events:', error.message);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
});

app.post('/api/test-user', async (req, res) => {
    try {
        const testUser = await User.create({ email: 'test@example.com', password: 'password' });
        res.status(201).json(testUser);
    } catch (error) {
        console.error('Error creating test user:', error);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
});

app.post('/api/bandsintown/parse-events', async (req, res) => {
    try {
        const { artist, region } = req.body;
        await parseEvent(artist, region);
        res.status(200).json({ message: 'Events parsed and saved successfully.' });
    } catch (error) {
        console.error('Error parsing events:', error);
        res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
});

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');

        const [result] = await sequelize.query('SELECT version();');
        console.log('PostgreSQL version:', result[0].version);

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

startServer();
