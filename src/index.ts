import express, { Request, Response } from 'express';
import User from './models/User';
import Rabbitmq from './config/rabbitmq';

const app = express();

Rabbitmq.start();

app.post('/users', async (req: Request, res: Response) => {
  const newUser = await User.create({
    name: 'Nauval Shidqi',
    preferredName: 'Shid',
    gender: 'male',
  });

  const content = Buffer.from(JSON.stringify(newUser));
  Rabbitmq.publish('jobs', content, 60000);

  res.send(newUser);
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello');
});

app.listen(4000, () => {
  console.log('server running on port 4000');
});
