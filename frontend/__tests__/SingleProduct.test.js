import { MockedProvider } from '@apollo/react-testing';
import { render, screen } from '@testing-library/react';
import SingleProduct, { SINGLE_ITEM_QUERY } from '../components/SingleProduct';
import { fakeItem } from '../lib/testUtils';

const product = fakeItem();
const mocks = [
  {
    // when someone request this query and variable combo
    request: {
      query: SINGLE_ITEM_QUERY,
      variables: {
        id: 'abc123',
      },
    },
    // return this data
    result: {
      data: {
        Product: product,
      },
    },
  },
];

describe('<SingleProduct />', () => {
  it('renders with proper data', async () => {
    // we need to make some fake data
    const { container, debug } = render(
      <MockedProvider mocks={mocks}>
        <SingleProduct id="abc123" />
      </MockedProvider>
    );

    // wait for the test-id to show up
    await screen.findByTestId('singleProduct');
    expect(container).toMatchSnapshot();
  });

  it('errors out when an item is not found', async () => {
    const errorMocks = [
      {
        request: {
          query: SINGLE_ITEM_QUERY,
          variables: {
            id: 'abc123',
          },
        },
        result: {
          errors: [{ message: 'Item not found!!!' }],
        },
      },
    ];

    const { container, debug } = render(
      <MockedProvider mocks={errorMocks}>
        <SingleProduct id="abc123" />
      </MockedProvider>
    );

    await screen.findByTestId('graphql-error');
    expect(container).toHaveTextContent('Shoot!');
    expect(container).toHaveTextContent('Item not found!!!');
  });
});
