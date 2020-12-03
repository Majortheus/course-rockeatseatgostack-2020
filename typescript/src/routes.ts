import { Request, Response } from 'express';
import createUser from './services/CreateUser';

export function helloWorld(req: Request, res: Response) {
  const user = createUser({
    name: 'Diego',
    email: 'diego@rockeatseat.com.br',
    password: '123456',
    techs: ['Node.js', 'ReactJS', 'React Native', { title: 'Javacript', experience: 78 }],
  });

  return res.json({ message: 'Hello World' });
}
