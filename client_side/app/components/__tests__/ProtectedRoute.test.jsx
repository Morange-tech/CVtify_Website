import { render, screen } from '@testing-library/react';

const pushMock = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

const useAuthMock = jest.fn();
jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => useAuthMock(),
}));

import ProtectedRoute from '../ProtectedRoute';

beforeEach(() => {
  pushMock.mockClear();
  useAuthMock.mockReset();
});

it('shows a loading state and does not redirect while auth is resolving', () => {
  useAuthMock.mockReturnValue({ isAuthenticated: false, loading: true });

  render(
    <ProtectedRoute>
      <div>secret content</div>
    </ProtectedRoute>
  );

  expect(screen.getByText('Loading...')).toBeInTheDocument();
  expect(screen.queryByText('secret content')).not.toBeInTheDocument();
  expect(pushMock).not.toHaveBeenCalled();
});

it('redirects to /login and renders nothing when unauthenticated', () => {
  useAuthMock.mockReturnValue({ isAuthenticated: false, loading: false });

  render(
    <ProtectedRoute>
      <div>secret content</div>
    </ProtectedRoute>
  );

  expect(pushMock).toHaveBeenCalledWith('/login');
  expect(screen.queryByText('secret content')).not.toBeInTheDocument();
});

it('renders children when authenticated', () => {
  useAuthMock.mockReturnValue({ isAuthenticated: true, loading: false });

  render(
    <ProtectedRoute>
      <div>secret content</div>
    </ProtectedRoute>
  );

  expect(screen.getByText('secret content')).toBeInTheDocument();
  expect(pushMock).not.toHaveBeenCalled();
});
