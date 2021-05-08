import FakeAppointmentRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppError from '@shared/errors/AppError';

let fakeAppointmentRepository: FakeAppointmentRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentRepository,
      fakeNotificationsRepository,
      fakeCacheProvider
    );
  })

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 10, 12).getTime();
    });

    const appointment = await createAppointmentService.execute({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2021, 4, 10, 13),
    });

    expect(appointment).toBeTruthy();
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2021, 4, 10, 13);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 10, 12).getTime();
    });

    await createAppointmentService.execute({
      provider_id: 'provider',
      user_id: 'user',
      date: appointmentDate,
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 10, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        provider_id: 'provider',
        user_id: 'user',
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('shoud not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 10, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        provider_id: 'provider',
        user_id: 'user',
        date: new Date(2021, 4, 10, 11),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('shoud not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 10, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        provider_id: 'provider',
        user_id: 'provider',
        date: new Date(2021, 4, 10, 13),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('shoud not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 10, 12).getTime();
    });

    await expect(
      createAppointmentService.execute({
        provider_id: 'provider',
        user_id: 'user',
        date: new Date(2021, 4, 11, 7),
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointmentService.execute({
        provider_id: 'provider',
        user_id: 'user',
        date: new Date(2021, 4, 11, 18),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
