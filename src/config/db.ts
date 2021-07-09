import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const sequelize = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
  host: 'db',
  dialect: 'postgres',
  port: 5432,
  logging: false,
});

if (sequelize) {
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection to db has been established.');

      sequelize
        .sync({ alter: true })
        .then(() => {
          console.log('All models were synchronized successfully.');
        })
        .catch((err) => {
          console.error('Unable to synchronize: ', err);
        });
    })
    .catch((err) => {
      console.error('Unable to connect to the database: ', err);
    });
}

export default sequelize;
