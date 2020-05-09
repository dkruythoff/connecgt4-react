
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

function getWinner(arrays, board, turn) {
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

function getFreeIndexPerColumn(board) {
  return board.map(col => col.findIndex(cell => cell === null))
}

function getBoard(cols, rows) {
  return new Array(cols).fill(null).map(
    (col, colIndex) => new Array(rows).fill(null).map(
      () => ({ value: null, winner: false })
    )
  )
}

export class Connect4 {
  constructor(cols = 7, rows = 6) {
    this.board = new Array(cols).fill(null).map(() => new Array(rows).fill(null))
    this.freeIndexPerColumn = getFreeIndexPerColumn(this.board)
    this.arrays = getArrays(this.board)
    this.turn = 1
    this.winner = false
  }
  makeMove(col) {
    const colFreeIndex = this.freeIndexPerColumn[col]

    if (colFreeIndex > -1) {
      this.board[col][colFreeIndex] = this.turn
      this.freeIndexPerColumn = getFreeIndexPerColumn(this.board)
      this.winner = getWinner(this.arrays, this.board, this.turn)
      if (!this.winner) {
        this.turn = this.turn === 1 ? 2 : 1
      }
    }
  }
}

const defaultState = {
  cols: 7,
  rows: 6,
  moves: []
}
export function play(
  {
    cols = defaultState.cols,
    rows = defaultState.rows,
    moves = defaultState.moves
  } = defaultState,
  playColumn = 0) {
  const board = getBoard(cols, rows)

  return {
    board
  }
}


/*

cols
rows
moves [

]
*/
