import express from 'express';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import router from './src/routes/users.js';
import eventRoutes from './src/routes/eventRoutes.js';
import tripRoutes from './src/routes/tripRoutes.js';
import accomRoutes from './src/routes/accomRoutes.js';  
import ticketmRoutes from './src/routes/ticketmRoutes.js';
import config from './src/config/config.js';
import { User } from './src/models/User.js';
import { bookFlightAndCreateTrip } from './src/services/Flights/googleFlights.js';
import { searchEventsByCityAndDate } from './src/services/Afisha/ticketmService.js';
// import { searchAccommodations } from './src/services/Accommodations/googleHotels.js';

dotenv.config();

const requiredEnvVars = ['PGHOST', 'PGDATABASE', 'PGUSER', 'PGPASSWORD', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars.join(', '));
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/auth', router);
app.use('/api/events', eventRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/accommodations', accomRoutes); 
app.use('/api/ticketmaster', ticketmRoutes); 

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
});

const calendars = [];

pp.post('/api/create-calendar', (req, res) => {
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
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/calendars', (req, res) => {
    try {
        res.status(200).json(calendars);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/book-flight', async (req, res) => {
    try {
        const result = await bookFlightAndCreateTrip(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/book-flight-and-find-events', async (req, res) => {
    try {
        const { destination, startDate, endDate } = req.body;
        const events = await searchEventsByCityAndDate(destination, new Date(startDate), new Date(endDate));
        res.status(200).json({ events });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/book-accommodation-and-find-events', async (req, res) => {
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

    const events = await searchEventsByCityAndDate(city, new Date(startDate), new Date(endDate));
    res.status(200).json({ accommodations, events });
});

app.post('/api/test-user', async (req, res) => {
    try {
        const testUser = await User.create({ email: 'test@example.com', password: 'password' });
        res.status(201).json(testUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
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