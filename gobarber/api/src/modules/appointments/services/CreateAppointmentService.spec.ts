import FakeAppointmentRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppError from '@shared/errors/AppError';

let fakeAppointmentRepository: FakeAppointmentRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();

    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentRepository,
    );

  })

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointmentService.execute({
      provider_id: '0',
      date: new Date(),
    });

    expect(appointment).toBeTruthy();
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('0');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2020, 4, 10, 11);

    await createAppointmentService.execute({
      provider_id: '0',
      date: appointmentDate,
    });

    expect(
      createAppointmentService.execute({
        provider_id: '0',
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
