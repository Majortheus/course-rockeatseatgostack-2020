import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UserMap from '@modules/users/mappings/UserMap';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

export default class UserAvatarController {
  public async update(req: Request, res: Response): Promise<Response> {
    const updateUserAvater = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvater.execute({
      user_id: req.user.id,
      avatar_fileName: req.file.filename,
    });

    const mappedUser = UserMap.toDTO(user);

    return res.json(mappedUser);
  }
}
