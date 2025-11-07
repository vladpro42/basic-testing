import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: jest.fn((fn) => fn),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;
// const mockedThrottle = throttle as jest.MockedFunction<typeof throttle>;

describe('throttledGetDataFromApi', () => {

  test('should create instance with provided base url', async () => {
    const relativePath = '/users';
    const mockData = [{ id: 1, name: 'John' }];

    const mockGet = jest.fn().mockResolvedValue({ data: mockData });
    const mockCreate = jest.fn().mockReturnValue({
      get: mockGet,
    });

    mockedAxios.create.mockImplementation(mockCreate);

    await throttledGetDataFromApi(relativePath);

    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const relativePath = '/posts/1';
    const mockData = { id: 1, title: 'Test Post' };

    const mockGet = jest.fn().mockResolvedValue({ data: mockData });
    const mockCreate = jest.fn().mockReturnValue({
      get: mockGet,
    });

    mockedAxios.create.mockImplementation(mockCreate);

    await throttledGetDataFromApi(relativePath);

    expect(mockGet).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const relativePath = '/todos';
    const mockData = [{ id: 1, title: 'Test Todo', completed: false }];

    const mockGet = jest.fn().mockResolvedValue({ data: mockData });
    const mockCreate = jest.fn().mockReturnValue({
      get: mockGet,
    });

    mockedAxios.create.mockImplementation(mockCreate);

    const result = await throttledGetDataFromApi(relativePath);

    expect(result).toEqual(mockData);
  });

});