import AppError from '@shared/errors/AppError';

import FakeUserRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileAvatar: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfileAvatar = new UpdateProfileService(
      fakeUserRepository,
      fakeHashProvider,
    );
  })

  it('should be able to update user avatar', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'test',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatar_fileName: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });
});
