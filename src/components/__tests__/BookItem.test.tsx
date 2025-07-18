import { render, screen, fireEvent } from '@testing-library/react';
import { BookItem } from '../BookItem';
import { MemoryRouter } from 'react-router-dom';

// Mock de useNavigate
const navigateMock = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigateMock,
}));

// Mock de useAuth
const useAuthMock = jest.fn();
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => useAuthMock(),
}));

// Mock de useToggleLike
const mutateMock = jest.fn();
jest.mock('../../hooks/useLikedBooks', () => ({
  useToggleLike: () => ({ mutate: mutateMock }),
}));

function renderBookItem(props?: Partial<React.ComponentProps<typeof BookItem>>) {
  return render(
    <MemoryRouter>
      <BookItem
        id={1}
        title="Clean Code"
        author="Robert C. Martin"
        image="img.jpg"
        isLiked={true}
        {...props}
      />
    </MemoryRouter>
  );
}

describe('BookItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza título e autor', () => {
    useAuthMock.mockReturnValue({ isAuthenticated: false });

    renderBookItem();

    expect(screen.getByText('Clean Code')).toBeInTheDocument();
    expect(screen.getByText('Robert C. Martin')).toBeInTheDocument();
  });

  it('quando não autenticado, clique redireciona para /login', () => {
    useAuthMock.mockReturnValue({ isAuthenticated: false });

    renderBookItem();

    fireEvent.click(screen.getByRole('button'));
    expect(navigateMock).toHaveBeenCalledWith('/login');
    expect(mutateMock).not.toHaveBeenCalled();
  });

  it('quando autenticado, clique chama mutate', () => {
    useAuthMock.mockReturnValue({ isAuthenticated: true });

    renderBookItem();

    fireEvent.click(screen.getByRole('button'));
    expect(mutateMock).toHaveBeenCalledWith(2);
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
