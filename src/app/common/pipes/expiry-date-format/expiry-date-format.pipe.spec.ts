import { ExpiryDateFormatPipe } from './expiry-date-format.pipe';
import { EXPIRY_DATE_PIPE_DATA } from '../../global-test.data';

describe('ExpiryDateFormatPipe', () => {
  it('create an instance', () => {
    const pipe = new ExpiryDateFormatPipe();
    expect(pipe).toBeTruthy();
  });

  // Testing expiryDateFormat pipe
  it('Testing transform method', () => {
    const pipe = new ExpiryDateFormatPipe();
    const pipeReurnValue = pipe.transform(EXPIRY_DATE_PIPE_DATA.mockExpirtDateValue);
    expect(pipeReurnValue).toEqual('12/20');
  });
});
