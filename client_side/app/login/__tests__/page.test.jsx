import { render, screen, fireEvent, waitFor } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

jest.mock('../../hooks/useLanguage', () => ({
  useLanguage: () => ({
    t: (key) => (key === 'login.features' ? [] : key),
  }),
}));

jest.mock('../../components/SuccessModal', () => ({
  __esModule: true,
  default: ({ open }) => (open ? <div data-testid="success-modal" /> : null),
}));

const mutateAsyncMock = jest.fn();
const useAuthMock = jest.fn();
jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => useAuthMock(),
}));

import LoginPage from '../page';

beforeEach(() => {
  mutateAsyncMock.mockReset();
  useAuthMock.mockReturnValue({
    loginMutation: { mutateAsync: mutateAsyncMock, isPending: false },
    isAuthenticated: false,
    user: null,
  });
});

it('blocks submission and shows a validation error for an invalid email', async () => {
  render(<LoginPage />);

  fireEvent.change(screen.getByLabelText('login.emailAddress'), { target: { value: 'not-an-email' } });
  fireEvent.change(screen.getByLabelText('login.password'), { target: { value: 'password123' } });
  fireEvent.click(screen.getByRole('button', { name: 'login.signIn' }));

  await waitFor(() => {
    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });
});

it('submits valid credentials to the login mutation', async () => {
  mutateAsyncMock.mockResolvedValue({ user: { role: 'user' } });

  render(<LoginPage />);

  fireEvent.change(screen.getByLabelText('login.emailAddress'), { target: { value: 'jane@example.com' } });
  fireEvent.change(screen.getByLabelText('login.password'), { target: { value: 'password123' } });
  fireEvent.click(screen.getByRole('button', { name: 'login.signIn' }));

  await waitFor(() => {
    expect(mutateAsyncMock).toHaveBeenCalledWith({
      email: 'jane@example.com',
      password: 'password123',
      rememberMe: false,
    });
  });

  expect(await screen.findByTestId('success-modal')).toBeInTheDocument();
});

it('shows the mutation error message when login fails', async () => {
  mutateAsyncMock.mockRejectedValue(new Error('The provided credentials are incorrect.'));

  render(<LoginPage />);

  fireEvent.change(screen.getByLabelText('login.emailAddress'), { target: { value: 'jane@example.com' } });
  fireEvent.change(screen.getByLabelText('login.password'), { target: { value: 'wrong-password' } });
  fireEvent.click(screen.getByRole('button', { name: 'login.signIn' }));

  expect(await screen.findByText('The provided credentials are incorrect.')).toBeInTheDocument();
});
