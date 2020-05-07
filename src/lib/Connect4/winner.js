function checkLine(line) {
  return /([12]),\1,\1,\1/.test(line.toString())
}

function getWinningCoordinates(coordinates, values, turn) {
  const winningCoordinates = []
  values.some((value, index) => {
    if (value === turn) {
      winningCoordinates.push(coordinates[index])
    } else {
      winningCoordinates.splice(0, winningCoordinates.length)
    }
    return winningCoordinates.length >= 4
  })

  return winningCoordinates
}

export function getWinner(arrays, board, turn) {
  let winner = false
  arrays.some((array) => {
    const { coordinates } = array
    const values = coordinates.map(([x, y]) => board[x][y])
    if (checkLine(values)) {
      const winningCoordinates = getWinningCoordinates(coordinates, values, turn)
      winner = { ...array, winningCoordinates }
      return true
    }
    return false
  })
  return winner
}
