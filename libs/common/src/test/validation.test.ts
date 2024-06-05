import { isValidPRN } from '@admiin-com/ds-common';
import { describe, expect, it } from 'vitest';

describe('PRN validation', () => {
  const prns = [
    '551001397796607701',
    '551001492977469001',
    '551008660947982801',
    '551001435775146501',
    '551003995256276501',
    '551002639012917521',
    '525000711191291521',
    '501000711191290306',
    '505000711191294406',
    '517000711191290106',
    '551009461697904021',
    '551002578560232801',
    '551001245380898001',
    '551001862605047501',
    '551001259952084001',
    '554009371729192806',
    '551008882922245101',
    '551003464961423001',
    '551002612054671601',
    '002000916914995621',
  ];

  const invalidPrns = [
    '551001397796a07701',
    '001492977469001',
    'INV30004',
    '1',
    'assadasd123we212313',
    '1231231',
  ];

  it('Are valid PRNs', () => {
    for (const prn of prns) {
      expect(isValidPRN(prn)).toBe(true);
    }
  });

  it('Are invalid PRNs', () => {
    for (const prn of invalidPrns) {
      expect(isValidPRN(prn)).toBe(false);
    }
  });
});
