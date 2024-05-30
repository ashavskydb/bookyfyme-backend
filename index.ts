import express from 'express';
import { sequelize } from './database/db';
import dotenv from 'dotenv';
import userRoutes from './routes/users.r';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/users', userRoutes);

sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    return sequelize.sync({ force: true }); 
  })
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log('Error: ' + err));