import Login from './Login';
import { render, screen, userEvent } from '../../utils/test-utils';

describe('login test', () => {
  test('renders icon', () => {
    render(<Login />);
    expect(screen.getByTestId('LockOutlinedIcon')).toBeInTheDocument();
    expect(screen.getByTestId('VisibilityIcon')).toBeInTheDocument();
    expect(screen.getByTestId('SendIcon')).toBeInTheDocument();
    expect(screen.getAllByText('Sign In')).toHaveLength(2);
    expect(screen.getByRole('heading', { name: /Sign In/i }));
  });
  test('fields type', () => {
    render(<Login />);
    const email = screen.getByRole<HTMLInputElement>('textbox', { name: /email address/i });
    const password = screen.getByLabelText<HTMLInputElement>(/Password/i);
    expect(email).toBeRequired();
    expect(password).toBeRequired();
    expect(password.value).toBe('');
    expect(email.value).toBe('');

    userEvent.type(email, 'email.com');
    expect(email.value).toBe('email.com');
    userEvent.type(password, '123123123');
    expect(password.value).toBe('123123123');
  });
  test('error helper', async () => {
    render(<Login />);
    const email = screen.getByRole<HTMLInputElement>('textbox', { name: /email address/i });
    const password = screen.getByLabelText<HTMLInputElement>(/Password/i);

    expect(screen.queryByText(/incorrect email/i)).not.toBeInTheDocument();
    userEvent.type(password, '1234');
    userEvent.type(email, 'email.com{enter}');
    expect(await screen.findByText(/incorrect email/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/Your password must be at least 6 characters long/i)
    ).toBeInTheDocument();
  });
});
