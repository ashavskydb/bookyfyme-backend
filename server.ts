import express from 'express';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import Routes from './routes/users.r';
import { config } from './config/consts';
import { User } from './models/User';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());


app.use('/api/auth');


const sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USER!, process.env.DB_PASS!, {
  host: process.env.DB_HOST!,
  dialect: 'postgres',
});


sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    return sequelize.sync({ force: true });
  })
  .then(() => {
    console.log('Database synced');
  
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err: any) => console.log('Error: ' + err));
