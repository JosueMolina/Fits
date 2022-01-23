import { render } from '@testing-library/react';
import wait from 'waait';
import CartCount from '../components/CartCount';

describe('<CartCount />', () => {
  it('renders', () => {
    render(<CartCount count={10} />);
  });

  it('matches snapshot', () => {
    const { container } = render(<CartCount count={11} />);
    expect(container).toMatchSnapshot();
  });

  it('updates via props', async () => {
    const { container, rerender, debug } = render(<CartCount count={11} />);
    expect(container.textContent).toBe('11'); // the same as below
    expect(container).toHaveTextContent('11'); // the same as above

    // update the props
    rerender(<CartCount count={12} />);

    // when they overlayp while doing the css animation
    expect(container.textContent).toBe('1211');

    // wait for __ miliseconds
    await wait(400);

    expect(container.textContent).toBe('12');

    expect(container).toMatchSnapshot();
  });
});
