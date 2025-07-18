import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLikedBooks, useToggleLike } from '../useLikedBooks';
import { api } from '../../api/axios';


jest.mock('../../const', () => ({
  API_URL: 'http://mock-api',
}));

jest.mock('../../api/axios');
const mockedApi = api as jest.Mocked<typeof api>;

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useLikedBooks', () => {
  it('faz GET /books/liked e devolve dados', async () => {
    const fakeData = [{ id: 1, title: 'Clean Code' }];
    mockedApi.get.mockResolvedValueOnce({ data: fakeData });

    const { result } = renderHook(() => useLikedBooks(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(fakeData);
    expect(mockedApi.get).toHaveBeenCalledWith('/books/liked');
  });
});

describe('useToggleLike', () => {
  it('faz POST /books/:id/like e invalida caches', async () => {
    mockedApi.post.mockResolvedValueOnce({ data: { liked: true } });

    const queryClient = new QueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useToggleLike(), { wrapper });

    await result.current.mutateAsync(1);

    expect(mockedApi.post).toHaveBeenCalledWith('/books/1/like');
  });
});
