import { jsonStringifySafe } from '../../../_common/utils/json-stringify-safe';

describe('utils:json-stringify-safe', () => {
  const ERROR = 'Error during stringifying: ';

  it('When: Object passed. Expected: Stringified object', () => {
    const inputValue = { a: 1 };
    const expected = '{"a":1}';

    const actual = jsonStringifySafe(inputValue, 0);

    expect(actual).toBe(expected);
  });

  it('When: Object has circular property. Expected: "Error during stringifying"', () => {
    const inputValue = { circularProp: {} };
    inputValue.circularProp = inputValue;

    const actual = jsonStringifySafe(inputValue);

    expect(actual).toContain(ERROR);
  });
});
