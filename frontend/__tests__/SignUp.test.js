import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import userEvent from '@testing-library/user-event';
import SignUp, { SIGNUP_MUTATION } from '../components/SignUp';
import { makePaginationMocksFor, fakeUser } from '../lib/testUtils';
import { CURRENT_USER_QUERY } from '../components/User';

const me = fakeUser();
const pass = 'test';

const mocks = [
  // mutation mock
  {
    request: {
      query: SIGNUP_MUTATION,
      variables: {
        name: me.name,
        email: me.email,
        password: pass,
      },
    },
    result: {
      data: {
        createUser: {
          __typename: 'User',
          id: 'abc123',
          email: me.email,
          name: me.name,
        },
      },
    },
  },
  // current user mock
  // {
  //   request: { query: CURRENT_USER_QUERY },
  //   result: { data: { authenticatedItem: me } },
  // },
];

describe('<SignUp />', () => {
  it('renders and matches snapshot', () => {
    const { container } = render(
      <MockedProvider>
        <SignUp />
      </MockedProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it('call the mutationi properly', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={mocks}>
        <SignUp />
      </MockedProvider>
    );
    // type into the boxes
    await userEvent.type(screen.getByPlaceholderText(/name/i), me.name);
    await userEvent.type(screen.getByPlaceholderText(/email/i), me.email);
    await userEvent.type(screen.getByPlaceholderText(/password/i), pass);

    // click the submit button
    const submitButton = screen.getByText('Sign Up');
    expect(submitButton).toBeInTheDocument();
    await userEvent.click(screen.getByText('Sign Up'));
    await screen.findByText(
      `Signed up with ${me.email} - Please go ahead and Sign in`
    );
  });
});
