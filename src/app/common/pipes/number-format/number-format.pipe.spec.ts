import { NumberFormatPipe } from './number-format.pipe';
import { NUMBER_FORMAT_TEST_DATA } from '../../global-test.data';

describe('numberFormat', () => {
  const pipe = new NumberFormatPipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  // Testing numberFormat pipe
  it('Testing transform method', () => {
    const returnValue = pipe.transform(undefined);
    expect(returnValue).toBeFalsy();
  });

  // Testing numberFormat pipe
  it('should return the formatted number', () => {
    const returnValue = pipe.transform(NUMBER_FORMAT_TEST_DATA.number);
    expect(returnValue).toEqual(NUMBER_FORMAT_TEST_DATA.formattedNumber);
  });
});
