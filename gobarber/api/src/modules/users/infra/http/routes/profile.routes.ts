import { Router } from 'express';

import ProfileController from '@modules/users/infra/http/controllers/ProfileController';
import ensureAuthentucated from '@modules/users/infra/http/middlewares/ensureAuthentucated';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureAuthentucated);

profileRouter.get('/', profileController.show);
profileRouter.put('/', profileController.update);

export default profileRouter;
