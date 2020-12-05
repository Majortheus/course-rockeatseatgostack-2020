import { json, Router } from 'express';
import appointmentsRouter from './appointments.routes';

const routes = Router();

routes.use(json());
routes.use('/appointments', appointmentsRouter);

export default routes;
