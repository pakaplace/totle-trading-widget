import BN from 'bignumber.js'
import numeral from 'numeral'

export default (num, shiftLeft, decimals, shorten = false) => {
  const ifShiftLeft = shiftLeft ? -1 : 1
  if (num === undefined) return null
  if (decimals === null) console.warn('No decimal data available for token contract')
  if (decimals === 0) return shorten ? numeral(new BN(num.toString()).shiftedBy(0).toString()).format("0,0.0000")
    : new BN(num.toString()).shiftedBy(0).toString()
  return shorten ? numeral(new BN(num.toString()).shiftedBy(ifShiftLeft * (decimals || 18)).toString()).format("0,0.0000")
    : new BN(num.toString()).shiftedBy(ifShiftLeft * (decimals || 18)).toString()
}