export function getFreeIndexPerColumn(board) {
  return board.map(col => col.findIndex(cell => cell.value === null))
}

export function getBoard(cols, rows) {
  return new Array(cols).fill(null).map(
    () => new Array(rows).fill(null).map(
      () => ({ value: null, winner: false })
    )
  )
}

export function getBoardWithMoves(_board, moves = []) {
  const board = JSON.parse(JSON.stringify(_board)) // clone the board to prevent mutations

  if (moves.length) {
    moves.forEach(([col, row, value]) => {
      if (col < board.length && row < board[col].length) {
        board[col][row].value = value
      }
    })
  }

  return board
}

export function getBoardWithWinners(_board, winners = []) {
  const board = JSON.parse(JSON.stringify(_board)) // clone the board to prevent mutations

  if (winners.length) {
    winners.forEach(([col, row]) => {
      if (col < board.length && row < board[col].length) {
        board[col][row].winner = true
      }
    })
  }

  return board
}
