/* eslint-disable @typescript-eslint/ban-ts-comment */
import { isNotServerErrorStatusCode } from '../../../_common/utils/is-not-server-error-status-code';

describe('utils:isNotServerErrorStatusCode', () => {
  it('When: Status code 200 or 201. Expected: true', () => {
    expect(isNotServerErrorStatusCode(200)).toBe(true);
    expect(isNotServerErrorStatusCode(201)).toBe(true);
  });

  it('When: Status code is 5XX. Expected: false', () => {
    expect(isNotServerErrorStatusCode(500)).toBe(false);
    expect(isNotServerErrorStatusCode(502)).toBe(false);
  });

  it('When: Status code is not correct. Expected: false', () => {
    expect(isNotServerErrorStatusCode(99)).toBe(false);
    expect(isNotServerErrorStatusCode(600)).toBe(false);
  });

  it('When: String with status code passed ignoring TS. Expected: Not broken behaviour', () => {
    // @ts-ignore
    expect(isNotServerErrorStatusCode('200')).toBe(true);
    // @ts-ignore
    expect(isNotServerErrorStatusCode('500')).toBe(false);
  });

  it('When: undefined passed ignoring TS. Expected: false', () => {
    // @ts-ignore
    expect(isNotServerErrorStatusCode(undefined)).toBe(false);
  });

  it('When: Status name passed ignoring TS. Expected: false', () => {
    // @ts-ignore
    expect(isNotServerErrorStatusCode('OK')).toBe(false);
  });
});
