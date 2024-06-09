import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

export class Bandsintown extends Sequelize.Model {}
Bandsintown.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Bandsintown'
});

export default Bandsintown;

export async function parseEvent(artist, region) {
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
