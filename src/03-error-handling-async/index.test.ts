import { throwError, throwCustomError, resolveValue, MyAwesomeError, rejectCustomError } from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    const res = await resolveValue('pineapple');
    expect(res).toBe('pineapple')
  });
   test('should resolve provided value', async () => {
    const res = await resolveValue(null);
    expect(res).toBe(null)
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    expect( () => {
      throwError('hello world!')
    }).toThrow('hello world!' )

  });

  test('should throw error with default message if message is not provided', () => {
   expect( () => {
      throwError()
    }).toThrow( 'Oops' )
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
     expect(() => {
      throwCustomError()
    }).toThrow( MyAwesomeError)
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    await expect(rejectCustomError()).rejects.toThrow(MyAwesomeError)
  });
});
