import { describe, it, expect } from 'vitest';
import sanitizeVerificationMethod from '../../../src/keyGenerators/utils/sanitizeVerificationMethod.js';

describe('sanitizeVerificationMethod', function () {
  const mockVerificationMethod = {
    id: 'did:example:123#key-1',
    type: 'EcdsaSecp256k1VerificationKey2019',
    controller: 'did:example:123',
  }

  it('should return the id of the verificationMethod', function () {
    const output = sanitizeVerificationMethod(mockVerificationMethod);
    expect(output.id).toEqual('did:example:123#key-1');
  });

  it('should return the type of the verificationMethod', function () {
    const output = sanitizeVerificationMethod(mockVerificationMethod);
    expect(output.type).toEqual('EcdsaSecp256k1VerificationKey2019');
  });

  it('should return the controller of the verificationMethod', function () {
    const output = sanitizeVerificationMethod(mockVerificationMethod);
    expect(output.controller).toEqual('did:example:123');
  });

  describe('when the verificationMethod has a publicKeyMultibase', function () {
    it('should return the publicKeyMultibase of the verificationMethod', function () {
      const mockVerificationMethodMultibase = {
        ...mockVerificationMethod,
        publicKeyMultibase: 'z6MkpDrjMkZu8tXxfgFvREHAwvSAgy7ZE9Wo4u9cL1mkFfQf'
      };
      const output = sanitizeVerificationMethod(mockVerificationMethodMultibase);
      expect(output.publicKeyMultibase).toEqual('z6MkpDrjMkZu8tXxfgFvREHAwvSAgy7ZE9Wo4u9cL1mkFfQf');
    });
  });

  describe('when the verificationMethod has a publicKeyJwk', function () {
    it('should return the publicKeyJwk of the verificationMethod', function () {
      const mockVerificationMethodMultibase = {
        ...mockVerificationMethod,
        publicKeyJwk: {
          kty: 'EC',
          crv: 'secp256k1',
          x: '5nO-i3vXa_nM2Fhl54hq1AB5dLK-yot6p0DRhgAka7E',
          y: 'eNbUdpGXAaxky4NSmfk2sn-RmJqsV2BAyGVHnQMCW1Y',
          kid: '74h6LxmxISaNHHznLBeSM_oFiViEmc4idti4VnJlFp4'
        }
      };
      const output = sanitizeVerificationMethod(mockVerificationMethodMultibase);
      expect(output.publicKeyJwk).toEqual({
        kty: 'EC',
        crv: 'secp256k1',
        x: '5nO-i3vXa_nM2Fhl54hq1AB5dLK-yot6p0DRhgAka7E',
        y: 'eNbUdpGXAaxky4NSmfk2sn-RmJqsV2BAyGVHnQMCW1Y',
        kid: '74h6LxmxISaNHHznLBeSM_oFiViEmc4idti4VnJlFp4'
      });
    });
  });

  describe('when the verificationMethod has a publicKeyBase58', function () {
    it('should return the publicKeyBase58 of the verificationMethod', function () {
      const mockVerificationMethodMultibase = {
        ...mockVerificationMethod,
        publicKeyBase58: 'CTqnzW2i8ZdrGT83htX7WpZnXEtJDA2zmSVfDiPEFAVc'
      };
      const output = sanitizeVerificationMethod(mockVerificationMethodMultibase);
      expect(output.publicKeyBase58).toEqual('CTqnzW2i8ZdrGT83htX7WpZnXEtJDA2zmSVfDiPEFAVc');
    });
  });

  describe('when the verificationMethod has a revoked property', function () {
    it('should return the revoked of the verificationMethod', function () {
      const mockVerificationMethodMultibase = {
        ...mockVerificationMethod,
        revoked: '2025-12-31T23:59:59Z'
      };
      const output = sanitizeVerificationMethod(mockVerificationMethodMultibase);
      expect(output.revoked).toEqual('2025-12-31T23:59:59Z');
    });
  });

  describe('when the verificationMethod has an expires property', function () {
    it('should return the expires of the verificationMethod', function () {
      const mockVerificationMethodMultibase = {
        ...mockVerificationMethod,
        expires: '2025-12-31T23:59:59Z'
      };
      const output = sanitizeVerificationMethod(mockVerificationMethodMultibase);
      expect(output.expires).toEqual('2025-12-31T23:59:59Z');
    });
  });

  describe('when the verificationMethod has a privateKey property', function () {
    it('should not return the privateKey of the verificationMethod', function () {
      const mockVerificationMethodMultibase = {
        ...mockVerificationMethod,
        privateKey: 'awesomeprivatekey'
      };
      const output = sanitizeVerificationMethod(mockVerificationMethodMultibase);
      expect(output.privateKey).toEqual(undefined);
    });
  });

  describe('when the verificationMethod has an address property', function () {
    it('should not return the address of the verificationMethod', function () {
      const mockVerificationMethodMultibase = {
        ...mockVerificationMethod,
        address: 'awesomeaddress'
      };
      const output = sanitizeVerificationMethod(mockVerificationMethodMultibase);
      expect(output.address).toEqual(undefined);
    });
  });

  describe('when the verificationMethod has an blockchain property', function () {
    it('should not return the blockchain of the verificationMethod', function () {
      const mockVerificationMethodMultibase = {
        ...mockVerificationMethod,
        blockchain: 'buttcoin'
      };
      const output = sanitizeVerificationMethod(mockVerificationMethodMultibase);
      expect(output.blockchain).toEqual(undefined);
    });
  });
});
