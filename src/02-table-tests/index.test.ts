 import {  simpleCalculator, Action } from './index';

const testCases = [
    { a: 1, b: 2, action: Action.Add, expected: 3 },
    { a: 2, b: -1, action: Action.Add, expected: 1 },
    { a: 0.5, b: 1, action: Action.Add, expected: 1.5 },
    { a: -0.5, b: 1, action: Action.Subtract, expected: -1.5 },
    { a: 15, b: 13, action: Action.Subtract, expected: 2 },
    { a: 20, b: 4, action: Action.Divide, expected: 5 },
    { a: 15, b: 0, action: Action.Divide, expected: Infinity },
    { a: 5, b: 2.5, action: Action.Divide, expected: 2 },
    { a: 0, b: 5, action: Action.Multiply, expected: 0 },
    { a: -5, b: 5, action: Action.Multiply, expected: -25 },
    { a: -5, b: -5, action: Action.Multiply, expected: 25 },
    { a:2, b: 3, action: Action.Exponentiate, expected: 8 },
    { a: 10, b: -1, action: Action.Exponentiate, expected: 0.1 },
    { a: 4, b: 0, action: Action.Exponentiate, expected: 1 },
    { a: 4, b: 0, action: '--', expected: null },
    { a: 'helloworld', b: false, action: Action.Exponentiate, expected: null },
]; 

describe('simpleCalculator', () => {
  test.each(testCases)('should return $expected when $a $action $b',({a,b,action,expected}) => {
    expect(simpleCalculator({a,b,action})).toBe(expected);
  })

});
