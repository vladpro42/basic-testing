import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';


import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';

jest.mock('fs')
jest.mock('fs/promises')
jest.mock('path', () => ({
  join: jest.fn()
}))

const mockedExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;
const mockedReadFile = readFile as jest.MockedFunction<typeof readFile>;
const mockedJoin = join as jest.MockedFunction<typeof join>;


describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn()
    const timeout = 1000
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout')
    doStuffByTimeout(callback, timeout)
    expect(setTimeoutSpy).toHaveBeenCalledWith(callback, timeout)
    setTimeoutSpy.mockRestore()
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn()
    const timeout = 1000
    doStuffByTimeout(callback, timeout)
    expect(callback).not.toHaveBeenCalled()
    jest.advanceTimersByTime(timeout)
    expect(callback).toHaveBeenCalledTimes(1)
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const cb = jest.fn()
    const interval = 1000
    const setIntervalSpy = jest.spyOn(global, 'setInterval')
    doStuffByInterval(cb, interval)
    expect(setIntervalSpy).toHaveBeenCalledWith(cb, interval)
    setIntervalSpy.mockRestore();
  });

  test('should call callback multiple times after multiple intervals', () => {

    const cb = jest.fn()
    const interval = 1000 
    doStuffByInterval(cb, interval)
    expect(cb).not.toHaveBeenCalled()
    jest.advanceTimersByTime(interval)
    expect(cb).toHaveBeenCalledTimes(1)
    jest.advanceTimersByTime(interval * 2)
    expect(cb).toHaveBeenCalledTimes(3)

  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const pathToFile = 'test.txt'
    mockedJoin.mockReturnValue('/fake/path/test.txt')
    await readFileAsynchronously(pathToFile)
    expect(mockedJoin).toHaveBeenCalledWith(__dirname, pathToFile)
  });

  test('should return null if file does not exist', async () => {
     const pathToFile = 'nonexistent.txt'
     mockedJoin.mockReturnValue('/fake/path/nonexistent.txt')
     mockedExistsSync.mockReturnValue(false)
     const result = await readFileAsynchronously(pathToFile)
     expect(mockedExistsSync).toHaveBeenCalledWith('/fake/path/nonexistent.txt')
     expect(mockedReadFile).not.toHaveBeenCalled();
     expect(result).toBeNull()

  });

  test('should return file content if file exists', async () => {
    const pathToFile = 'existing.txt';
    const fileContent = 'Hello, World!';
    mockedJoin.mockReturnValue('/fake/path/existing.txt');
    mockedExistsSync.mockReturnValue(true); 
    mockedReadFile.mockResolvedValue(Buffer.from(fileContent)); 
    const result = await readFileAsynchronously(pathToFile);
    expect(mockedExistsSync).toHaveBeenCalledWith('/fake/path/existing.txt');
    expect(mockedReadFile).toHaveBeenCalledWith('/fake/path/existing.txt');
    expect(result).toBe(fileContent);
  });
});
