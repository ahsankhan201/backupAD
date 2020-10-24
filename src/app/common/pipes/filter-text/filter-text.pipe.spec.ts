import { FilterTextPipe } from './filter-text.pipe';
import { COUNTRY_LIST_MOCK_DATA } from '../../global-test.data';

describe('FilterTextPipe', () => {
  const pipe = new FilterTextPipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  // Testing getDecimalValue pipe
  it('Testing transform method', () => {
    let returnedObj = pipe.transform(COUNTRY_LIST_MOCK_DATA, 'Al', 'countryName');
    expect(returnedObj[0].countryISOCode).toEqual(COUNTRY_LIST_MOCK_DATA[0].countryISOCode);
    // covering code of other cases
    returnedObj = pipe.transform(COUNTRY_LIST_MOCK_DATA, undefined, undefined);
    expect(returnedObj.length).toEqual(COUNTRY_LIST_MOCK_DATA.length);
    returnedObj = pipe.transform(undefined, 'Am', undefined);
    expect(returnedObj).toBeUndefined();
  });
});
