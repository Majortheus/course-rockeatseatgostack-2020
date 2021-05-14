import React from 'react';
import { render } from 'react-native-testing-library';

import SignIn from '../../Pages/SignIn';

jest.mock('@react-navigation/native', () => {
  return { useNavigation: jest.fn() };
});

describe('SignIn page', () => {
  it('shoud contains email/password inputs', () => {
    const { getByPlaceholder } = render(<SignIn />);

    expect(getByPlaceholder('E-mail')).toBeTruthy();
    expect(getByPlaceholder('Senha')).toBeTruthy();
  });
});
