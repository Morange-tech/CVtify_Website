import { render, screen, act } from '@testing-library/react';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from '../AuthContext';

function Consumer() {
  const { user, token, loading, isAuthenticated, login, logout, updateUser } = useContext(AuthContext);

  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="user">{user ? JSON.stringify(user) : 'null'}</span>
      <span data-testid="token">{token ?? 'null'}</span>
      <button onClick={() => login({ id: 1, name: 'Jane' }, 'token-123')}>login</button>
      <button onClick={() => updateUser({ name: 'Jane Updated' })}>update</button>
      <button onClick={() => logout()}>logout</button>
    </div>
  );
}

beforeEach(() => {
  localStorage.clear();
});

it('hydrates from localStorage on mount', async () => {
  localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Existing' }));
  localStorage.setItem('token', 'existing-token');

  render(
    <AuthProvider>
      <Consumer />
    </AuthProvider>
  );

  expect(await screen.findByTestId('loading')).toHaveTextContent('false');
  expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
  expect(screen.getByTestId('user')).toHaveTextContent('Existing');
  expect(screen.getByTestId('token')).toHaveTextContent('existing-token');
});

it('starts unauthenticated when localStorage is empty', async () => {
  render(
    <AuthProvider>
      <Consumer />
    </AuthProvider>
  );

  expect(await screen.findByTestId('loading')).toHaveTextContent('false');
  expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
  expect(screen.getByTestId('user')).toHaveTextContent('null');
});

it('login() sets state and persists to localStorage', async () => {
  render(
    <AuthProvider>
      <Consumer />
    </AuthProvider>
  );
  await screen.findByTestId('loading');

  act(() => {
    screen.getByText('login').click();
  });

  expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
  expect(screen.getByTestId('token')).toHaveTextContent('token-123');
  expect(JSON.parse(localStorage.getItem('user'))).toEqual({ id: 1, name: 'Jane' });
  expect(localStorage.getItem('token')).toBe('token-123');
});

it('updateUser() merges into existing user and persists', async () => {
  render(
    <AuthProvider>
      <Consumer />
    </AuthProvider>
  );
  await screen.findByTestId('loading');

  act(() => screen.getByText('login').click());
  act(() => screen.getByText('update').click());

  expect(screen.getByTestId('user')).toHaveTextContent('Jane Updated');
  expect(JSON.parse(localStorage.getItem('user'))).toEqual({ id: 1, name: 'Jane Updated' });
});

it('logout() clears state and localStorage', async () => {
  localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Existing' }));
  localStorage.setItem('token', 'existing-token');

  render(
    <AuthProvider>
      <Consumer />
    </AuthProvider>
  );
  await screen.findByTestId('loading');

  act(() => screen.getByText('logout').click());

  expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
  expect(screen.getByTestId('user')).toHaveTextContent('null');
  expect(localStorage.getItem('user')).toBeNull();
  expect(localStorage.getItem('token')).toBeNull();
});
