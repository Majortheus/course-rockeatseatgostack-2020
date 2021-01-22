import FakeUserRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from '@modules/users/services/CreateUserService';
import AppError from '@shared/errors/AppError';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createuserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    const user = await createuserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'test',
    });

    expect(user).toBeTruthy();
    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email from another user', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createuserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );

    await createuserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'test',
    });

    await expect(
      createuserService.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'test',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
