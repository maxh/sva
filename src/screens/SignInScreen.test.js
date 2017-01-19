import 'react-native';
import { shallow } from 'enzyme';
import React from 'react';
import { SignInScreen } from './SignInScreen';

jest.mock('react-native-google-signin', () => 'signin');


it('renders correctly when not loading', () => {
  const props = {
    signIn: jest.fn(),
    isLoading: false
  };

  const tree = shallow(
    <SignInScreen {...props} />
  );

  expect(tree).toMatchSnapshot();
});


it('renders correctly when loading', () => {
  const props = {
    signIn: jest.fn(),
    isLoading: true
  };

  const tree = shallow(
    <SignInScreen {...props} />
  );

  expect(tree).toMatchSnapshot();
});
