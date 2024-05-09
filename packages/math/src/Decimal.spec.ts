import Decimal from './Decimal.js'
import { describe, expect, it } from 'vitest'

describe('Decimal', () => {
  describe('fromPlanck', () => {
    it('leads to correct atomics value', () => {
      expect(Decimal.fromPlanck('1', 0).planck).toEqual(1n)
      expect(Decimal.fromPlanck('1', 1).planck).toEqual(1n)
      expect(Decimal.fromPlanck('1', 2).planck).toEqual(1n)

      expect(Decimal.fromPlanck('1', 5).planck).toEqual(1n)
      expect(Decimal.fromPlanck('2', 5).planck).toEqual(2n)
      expect(Decimal.fromPlanck('3', 5).planck).toEqual(3n)
      expect(Decimal.fromPlanck('10', 5).planck).toEqual(10n)
      expect(Decimal.fromPlanck('20', 5).planck).toEqual(20n)
      expect(Decimal.fromPlanck('30', 5).planck).toEqual(30n)
      expect(Decimal.fromPlanck('100000000000000000000000', 5).planck).toEqual(100000000000000000000000n)
      expect(Decimal.fromPlanck('200000000000000000000000', 5).planck).toEqual(200000000000000000000000n)
      expect(Decimal.fromPlanck('300000000000000000000000', 5).planck).toEqual(300000000000000000000000n)

      expect(Decimal.fromPlanck('44', 5).planck).toEqual(44n)
      expect(Decimal.fromPlanck('044', 5).planck).toEqual(44n)
      expect(Decimal.fromPlanck('0044', 5).planck).toEqual(44n)
      expect(Decimal.fromPlanck('00044', 5).planck).toEqual(44n)
    })

    it('reads decimals correctly', () => {
      expect(Decimal.fromPlanck('44', 0).toString()).toEqual('44')
      expect(Decimal.fromPlanck('44', 1).toString()).toEqual('4.4')
      expect(Decimal.fromPlanck('44', 2).toString()).toEqual('0.44')
      expect(Decimal.fromPlanck('44', 3).toString()).toEqual('0.044')
      expect(Decimal.fromPlanck('44', 4).toString()).toEqual('0.0044')
    })

    it('reads negative integer correctly', () => {
      expect(Decimal.fromPlanck('-44', 0).toString()).toEqual('-44')
      expect(Decimal.fromPlanck('-44', 1).toString()).toEqual('-4.4')
    })
  })

  describe('fromUserInput', () => {
    it('throws helpful error message for invalid characters', () => {
      expect(() => Decimal.fromUserInput(' 13', 5)).toThrowError(/invalid character at position 1/i)
      expect(() => Decimal.fromUserInput('1,3', 5)).toThrowError(/invalid character at position 2/i)
      expect(() => Decimal.fromUserInput('13-', 5)).toThrowError(/invalid character at position 3/i)
      expect(() => Decimal.fromUserInput('13/', 5)).toThrowError(/invalid character at position 3/i)
      expect(() => Decimal.fromUserInput('13\\', 5)).toThrowError(/invalid character at position 3/i)
    })

    it('throws for more than one separator', () => {
      expect(() => Decimal.fromUserInput('1.3.5', 5)).toThrowError(/more than one separator found/i)
      expect(() => Decimal.fromUserInput('1..3', 5)).toThrowError(/more than one separator found/i)
      expect(() => Decimal.fromUserInput('..', 5)).toThrowError(/more than one separator found/i)
    })

    it('throws for separator only', () => {
      expect(() => Decimal.fromUserInput('.', 5)).toThrowError(/fractional part missing/i)
    })

    it('throws for more decimals than supported', () => {
      expect(() => Decimal.fromUserInput('44.123456', 5)).toThrowError(/got more decimals than supported/i)
      expect(() => Decimal.fromUserInput('44.1', 0)).toThrowError(/got more decimals than supported/i)
    })

    it('throws for decimals that are not non-negative integers', () => {
      // no integer
      expect(() => Decimal.fromUserInput('1', Number.NaN)).toThrowError(/decimals is not an integer/i)
      expect(() => Decimal.fromUserInput('1', Number.POSITIVE_INFINITY)).toThrowError(/decimals is not an integer/i)
      expect(() => Decimal.fromUserInput('1', Number.NEGATIVE_INFINITY)).toThrowError(/decimals is not an integer/i)
      expect(() => Decimal.fromUserInput('1', 1.78945544484)).toThrowError(/decimals is not an integer/i)

      // negative
      expect(() => Decimal.fromUserInput('1', -1)).toThrowError(/decimals must not be negative/i)
      expect(() => Decimal.fromUserInput('1', Number.MIN_SAFE_INTEGER)).toThrowError(/decimals must not be negative/i)

      // exceeds supported range
      expect(() => Decimal.fromUserInput('1', 101)).toThrowError(/decimals must not exceed 100/i)
    })

    it('returns correct value', () => {
      expect(Decimal.fromUserInput('44', 0).planck).toEqual(44n)
      expect(Decimal.fromUserInput('44', 1).planck).toEqual(440n)
      expect(Decimal.fromUserInput('44', 2).planck).toEqual(4400n)
      expect(Decimal.fromUserInput('44', 3).planck).toEqual(44000n)

      expect(Decimal.fromUserInput('44.2', 1).planck).toEqual(442n)
      expect(Decimal.fromUserInput('44.2', 2).planck).toEqual(4420n)
      expect(Decimal.fromUserInput('44.2', 3).planck).toEqual(44200n)

      expect(Decimal.fromUserInput('44.1', 6).planck).toEqual(44100000n)
      expect(Decimal.fromUserInput('44.12', 6).planck).toEqual(44120000n)
      expect(Decimal.fromUserInput('44.123', 6).planck).toEqual(44123000n)
      expect(Decimal.fromUserInput('44.1234', 6).planck).toEqual(44123400n)
      expect(Decimal.fromUserInput('44.12345', 6).planck).toEqual(44123450n)
      expect(Decimal.fromUserInput('44.123456', 6).planck).toEqual(44123456n)
    })

    it('cuts leading zeros', () => {
      expect(Decimal.fromUserInput('4', 2).planck).toEqual(400n)
      expect(Decimal.fromUserInput('04', 2).planck).toEqual(400n)
      expect(Decimal.fromUserInput('004', 2).planck).toEqual(400n)
    })

    it('cuts tailing zeros', () => {
      expect(Decimal.fromUserInput('4.12', 5).planck).toEqual(412000n)
      expect(Decimal.fromUserInput('4.120', 5).planck).toEqual(412000n)
      expect(Decimal.fromUserInput('4.1200', 5).planck).toEqual(412000n)
      expect(Decimal.fromUserInput('4.12000', 5).planck).toEqual(412000n)
      expect(Decimal.fromUserInput('4.120000', 5).planck).toEqual(412000n)
      expect(Decimal.fromUserInput('4.1200000', 5).planck).toEqual(412000n)
    })

    it('interprets the empty string as zero', () => {
      expect(Decimal.fromUserInput('', 0).planck).toEqual(0n)
      expect(Decimal.fromUserInput('', 1).planck).toEqual(0n)
      expect(Decimal.fromUserInput('', 2).planck).toEqual(0n)
      expect(Decimal.fromUserInput('', 3).planck).toEqual(0n)
    })

    it('accepts american notation with skipped leading zero', () => {
      expect(Decimal.fromUserInput('.1', 3).planck).toEqual(100n)
      expect(Decimal.fromUserInput('.12', 3).planck).toEqual(120n)
      expect(Decimal.fromUserInput('.123', 3).planck).toEqual(123n)
    })
  })

  describe('toString', () => {
    it('displays no decimal point for full numbers', () => {
      expect(Decimal.fromUserInput('44', 0).toString()).toEqual('44')
      expect(Decimal.fromUserInput('44', 1).toString()).toEqual('44')
      expect(Decimal.fromUserInput('44', 2).toString()).toEqual('44')

      expect(Decimal.fromUserInput('44', 2).toString()).toEqual('44')
      expect(Decimal.fromUserInput('44.0', 2).toString()).toEqual('44')
      expect(Decimal.fromUserInput('44.00', 2).toString()).toEqual('44')
      expect(Decimal.fromUserInput('44.000', 2).toString()).toEqual('44')
    })

    it('only shows significant digits', () => {
      expect(Decimal.fromUserInput('44.1', 2).toString()).toEqual('44.1')
      expect(Decimal.fromUserInput('44.10', 2).toString()).toEqual('44.1')
      expect(Decimal.fromUserInput('44.100', 2).toString()).toEqual('44.1')
    })

    it('fills up leading zeros', () => {
      expect(Decimal.fromPlanck('3', 0).toString()).toEqual('3')
      expect(Decimal.fromPlanck('3', 1).toString()).toEqual('0.3')
      expect(Decimal.fromPlanck('3', 2).toString()).toEqual('0.03')
      expect(Decimal.fromPlanck('3', 3).toString()).toEqual('0.003')
    })
  })

  describe('toNumber', () => {
    it('works', () => {
      expect(Decimal.fromUserInput('0', 5).toNumber()).toEqual(0)
      expect(Decimal.fromUserInput('1', 5).toNumber()).toEqual(1)
      expect(Decimal.fromUserInput('1.5', 5).toNumber()).toEqual(1.5)
      expect(Decimal.fromUserInput('0.1', 5).toNumber()).toEqual(0.1)

      expect(Decimal.fromUserInput('1234500000000000', 5).toNumber()).toEqual(1.2345e15)
      expect(Decimal.fromUserInput('1234500000000000.002', 5).toNumber()).toEqual(1.2345e15)
    })
  })
})
