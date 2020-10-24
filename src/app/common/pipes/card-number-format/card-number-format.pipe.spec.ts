import { CardNumberFormatPipe } from './card-number-format.pipe';
import { CARD_NUMBER_PIPE_DATA } from '../../global-test.data';

describe('CardNumberFormatPipe', () => {
  it('create an instance', () => {
    const pipe = new CardNumberFormatPipe();
    expect(pipe).toBeTruthy();
  });

  // Testing formatMaskCardNumber pipe
  it('Testing transform method', () => {
    const pipe = new CardNumberFormatPipe();
    const pipeReurnValue = pipe.transform(CARD_NUMBER_PIPE_DATA.mockCardNumber);
    expect(pipeReurnValue).toEqual('**** **** **** *220');
  });
});
