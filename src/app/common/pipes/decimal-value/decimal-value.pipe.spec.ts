import { DecimalValuePipe } from './decimal-value.pipe';

describe('DecimalValuePipe', () => {
  const mockedDecimalAmountValue = 12324.33;
  const mockedIntegerAmountValue = 12324;

  it('create an instance', () => {
    const pipe = new DecimalValuePipe();
    expect(pipe).toBeTruthy();
  });
  // Testing getDecimalValue pipe
  it('Testing transform method', () => {
    const pipe = new DecimalValuePipe();
    let pipeReurnValue = pipe.transform(mockedDecimalAmountValue);
    expect(pipeReurnValue).toEqual('33');
    pipe.transform('');
    pipeReurnValue = pipe.transform(mockedIntegerAmountValue);
    expect(pipeReurnValue).toEqual('00');
  });
});
