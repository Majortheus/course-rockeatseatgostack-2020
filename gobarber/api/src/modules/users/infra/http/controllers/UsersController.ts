import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UserMap from '@modules/users/mappings/UserMap';
import CreateUserService from '@modules/users/services/CreateUserService';

export default class UserController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    const mappedUser = UserMap.toDTO(user);

    return res.json(mappedUser);
  }
}
