import AppError from '@shared/errors/AppError';

import FakeUserRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfileService = new UpdateProfileService(
      fakeUserRepository,
      fakeHashProvider,
    );
  })

  it('should be able to update the profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'test',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'John Tré',
      email: 'johntre@example.com'
    });

    expect(updatedUser.name).toBe('John Tré');
    expect(updatedUser.email).toBe('johntre@example.com');
  });

  it('should not be able to change to another user email', async () => {
    await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'test',
    });

    const user = await fakeUserRepository.create({
      name: 'teste',
      email: 'teste@example.com',
      password: 'test',
    });

    await expect(updateProfileService.execute({
      user_id: user.id,
      name: 'John Doe',
      email: 'johndoe@example.com'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'test',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'John Tré',
      email: 'johntre@example.com',
      password: '123123',
      old_password: 'test'
    });

    expect(updatedUser.password).toBe('123123');
  });

  
  it('should not be able to update the password without old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'test',
    });

    await expect(updateProfileService.execute({
      user_id: user.id,
      name: 'John Tré',
      email: 'johntre@example.com',
      password: '123123'
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'test',
    });

    await expect(updateProfileService.execute({
      user_id: user.id,
      name: 'John Tré',
      email: 'johntre@example.com',
      password: '123123',
      old_password: 'wrong-old-password'
    })).rejects.toBeInstanceOf(AppError);
  });
  
  it('should not be able to update the profile from non-existing user', async () => {
    await expect(
      updateProfileService.execute({ 
        user_id: 'non-existing-user-id',
        name: 'Test',
        email: 'teste@example.com'
      })).rejects.toBeInstanceOf(AppError);
  });
});
