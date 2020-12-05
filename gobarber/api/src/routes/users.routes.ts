import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import UserMap from '../mappers/UserMap';
import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

import ensureAuthentucated from '../middlewares/ensureAuthentucated';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  const createUser = new CreateUserService();

  const user = await createUser.execute({
    name,
    email,
    password,
  });

  const mappedUser = UserMap.toDTO(user);

  return res.json(mappedUser);
});

usersRouter.patch(
  '/avatar',
  ensureAuthentucated,
  upload.single('avatar'),
  async (req, res) => {
    const updateUserAvater = new UpdateUserAvatarService();

    const user = await updateUserAvater.execute({
      user_id: req.user.id,
      avatar_fileName: req.file.filename,
    });

    const mappedUser = UserMap.toDTO(user);

    return res.json(mappedUser);
  },
);
export default usersRouter;
