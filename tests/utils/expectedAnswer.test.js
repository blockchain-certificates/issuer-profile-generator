import { describe, it, expect } from 'vitest';
import { expectedAnswer } from '../../src/utils/expectedAnswer';

describe('expectedAnswer', () => {
  it('should return true when the answer matches the expected answer', () => {
    expect(expectedAnswer('yes', 'yes')).toBe(true);
  });

  it('should return true when the answer matches the shorthand of the expected answer', () => {
    expect(expectedAnswer('y', 'yes')).toBe(true);
  });

  it('should return false when the answer does not match the expected answer or shorthand', () => {
    expect(expectedAnswer('no', 'yes')).toBe(false);
  });

  it('should return true when the shorthand is provided explicitly and matches the answer', () => {
    expect(expectedAnswer('h', 'authentication', 'h')).toBe(true);
  });

  it('should return false when the shorthand is provided explicitly and does not match the answer', () => {
    expect(expectedAnswer('z', 'authentication', 'h')).toBe(false);
  });

  it('should return true when the answer matches the expected answer case insensitively', () => {
    expect(expectedAnswer('YES', 'yes')).toBe(true);
  });

  it('should return true when the answer matches the shorthand case insensitively', () => {
    expect(expectedAnswer('Y', 'yes')).toBe(true);
  });
});
