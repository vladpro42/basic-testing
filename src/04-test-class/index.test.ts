import { getBankAccount, InsufficientFundsError, SynchronizationFailedError, TransferFailedError } from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    expect(getBankAccount(150).getBalance()).toBe(150)
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const temp = getBankAccount(150)
    expect(() => temp.withdraw(300)).toThrow(InsufficientFundsError)
  });

  test('should throw error when transferring more than balance', () => {
  const temp = getBankAccount(150)
  const double = getBankAccount(200)
  expect(() => temp.transfer(151, double)).toThrow(InsufficientFundsError)
});

  test('should throw error when transferring to the same account', () => {
     const temp = getBankAccount(150)
    expect(() => temp.transfer(10, temp)).toThrow(TransferFailedError)
  });

  test('should deposit money', () => {
      const temp = getBankAccount(150)
      temp.deposit(150)
      expect(temp.getBalance()).toBe(300)
  });

  test('should withdraw money', () => {
    const temp = getBankAccount(150)
    temp.withdraw(20)
    expect(temp.getBalance()).toBe(130)
  });

  test('should transfer money', () => {
    const temp = getBankAccount(150)
    const double = getBankAccount(200)
    temp.transfer(150, double)
    expect(temp.getBalance()).toBe(0)
    expect(double.getBalance()).toBe(350)
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const temp = getBankAccount(150);
    const balance = await temp.fetchBalance();

    if(balance !== null ) {
      expect(typeof balance).toBe('number')
      expect(balance).toBeGreaterThanOrEqual(0)
      expect(balance).toBeLessThanOrEqual(100);
    } else {
      expect(balance).toBeNull()
    }
  });

   test('should set new balance if fetchBalance returned number', async () => {
    const temp = getBankAccount(150);
    
    const originalFetchBalance = temp.fetchBalance.bind(temp);
    temp.fetchBalance = jest.fn().mockResolvedValue(75);
    
    await temp.synchronizeBalance();
    expect(temp.getBalance()).toBe(75);
    
    temp.fetchBalance = originalFetchBalance;
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const temp = getBankAccount(150);
    
    const originalFetchBalance = temp.fetchBalance.bind(temp);
    temp.fetchBalance = jest.fn().mockResolvedValue(null);
    
    await expect(temp.synchronizeBalance()).rejects.toThrow(SynchronizationFailedError);
    
    temp.fetchBalance = originalFetchBalance;
  });
});
