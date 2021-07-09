import express from 'express';
import User from './models/User';
import Rabbitmq from './config/rabbitmq';

const app = express();

Rabbitmq.start();
// RABBITMQ.consume('jobs');

app.post('/users', async (req, res) => {
  const newUser = await User.create({
    name: 'Nauval Shidqi',
    preferredName: 'Shid',
    gender: 'male',
  });

  const content = Buffer.from(JSON.stringify(newUser));
  Rabbitmq.publish('jobs', content, 60000);

  res.send(newUser);
});

app.get('/', (req, res) => {
  res.send('Hello');
});

app.listen(4000, () => {
  console.log('server running on port 4000');
});
