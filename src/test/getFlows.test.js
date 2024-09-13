// useGetFlows.test.js
import { renderHook, act } from '@testing-library/react-hooks';
import useGetFlows from 'hooks/flows/useGetFlows';
import { getFlows } from 'services/flowsServices';

jest.mock('../services/flowsServices');

describe('useGetFlows', () => {
  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useGetFlows());

    expect(result.current.flows).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('should fetch flows successfully', async () => {
    const mockData = [{ id: 1, name: 'Flow 1' }];
    getFlows.mockResolvedValueOnce(mockData);

    const { result, waitForNextUpdate } = renderHook(() => useGetFlows());

    await waitForNextUpdate();

    expect(result.current.flows).toEqual(mockData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle fetch error', async () => {
    const mockError = new Error('Failed to fetch');
    getFlows.mockRejectedValueOnce(mockError);

    const { result, waitForNextUpdate } = renderHook(() => useGetFlows());

    await waitForNextUpdate();

    expect(result.current.flows).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(mockError);
  });

  it('should refetch flows', async () => {
    const mockData = [{ id: 1, name: 'Flow 1' }];
    getFlows.mockResolvedValueOnce(mockData);

    const { result, waitForNextUpdate } = renderHook(() => useGetFlows());

    await waitForNextUpdate();

    expect(result.current.flows).toEqual(mockData);

    const newMockData = [{ id: 2, name: 'Flow 2' }];
    getFlows.mockResolvedValueOnce(newMockData);

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.flows).toEqual(newMockData);
  });
});