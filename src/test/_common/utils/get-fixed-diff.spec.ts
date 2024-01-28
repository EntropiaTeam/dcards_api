import { getFixedDiff } from '../../../_common/utils/get-fixed-diff';

describe('utils:getFixedDiff', () => {
  it('When: Interger values passed. Expected: Integer value', () => {
    const actual = getFixedDiff(5, 1);

    expect(actual).toBe(4);
  });

  it('When: Float values with precision 4 passed. Expected: Float value with default precision', () => {
    const actual = getFixedDiff(5.9999, 4.1111);

    expect(actual).toBe(1.89);
  });

  it('When: Float values with precision 4 passed and 0 precision. Expected: Integer value', () => {
    const actual = getFixedDiff(5.9999, 4.1111, 0);

    expect(actual).toBe(2);
  });

  it('When: Float values with same values after float point. Expected: Integer value', () => {
    const actual = getFixedDiff(5.9999, 4.9999);

    expect(actual).toBe(1);
  });
});
