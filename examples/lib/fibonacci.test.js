const vm = require('vm');

const { fibonacci } = require('./fibonacci');

const invalidArg = [
  Infinity,
  NaN,
  -123,
  -3.123,
  1.123,
  0.123,
  '12.12',
  'asd',
  '',
  ,
  [],
  {},
  null,
  undefined,
  '123asd'
];
const expectFib = [0,1,1,2,3,5,8,13,21,34,55,89];
const TIME_LIMIT = 1000;
const TIME_TRIAL = 10000;

describe('fibonacci(n)', () => {
  invalidArg.forEach(invalid => {
    it(`should return -1 for fibonacci(${invalid})`, () => {
      expect(fibonacci(invalid)).to.equal(-1);
    });
  });

  expectFib.forEach((val, n) => {
    it(`should return ${val} for fibonacci(${n})`, () => {
      expect(fibonacci(n)).to.equal(val);
    })
  });

  it(`should exec fibonacci(${TIME_TRIAL}) in under ${TIME_LIMIT}ms`, done => {
    const context = {
      testFn(n) {
        fibonacci(n);
        done();
      }
    }

    const sandbox = vm.createContext(context);
    vm.runInContext(`testFn(${TIME_TRIAL})`, sandbox, {
      timeout: TIME_LIMIT,
    });
  });

  it('should return correct values without failing', () => {
    expect(fibonacci(Number.MAX_SAFE_INTEGER)).to.equal(Infinity);
  });
});
