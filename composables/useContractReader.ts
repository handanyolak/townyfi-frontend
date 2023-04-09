import { solidityPackedKeccak256 } from 'ethers'

export const getAddressesLengthByCoordinateSlot = (x: bigint, y: bigint) => {
  // find addressesByCoordinate[x]
  let slot = solidityPackedKeccak256(['int256', 'uint256'], [x, 5n])

  // find addressesByCoordinate[y][y]
  slot = solidityPackedKeccak256(['int256', 'uint256'], [y, slot])

  // find addressesByCoordinate[y][y][addresses].length
  return slot
}

export const getTownIdByCoordinateSlot = (x: bigint, y: bigint) => {
  // find townIdByCoordinate[0]
  let slot = solidityPackedKeccak256(['int256', 'uint256'], [x, 4n])

  // find townIdByCoordinate[0][0]
  slot = solidityPackedKeccak256(['int256', 'uint256'], [y, slot])

  return slot
}
