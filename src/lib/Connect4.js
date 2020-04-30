function getDiagonalToRightTop(x, y, xMax, yMax) {
  const diagonal = []
  while (x < xMax && y < yMax) {
    diagonal.push([x, y])
    x++
    y++
  }
  return diagonal
}

function getDiagonalToLeftTop(x, y, yMax) {
  const diagonal = []
  while (x >= 0 && y < yMax) {
    diagonal.push([x, y])
    x--
    y++
  }
  return diagonal
}

function getDiagonals(cols, rows) {
  const diagonals = []

  for (let x = 0; x < cols; x++) {
    // bottom to right top
    diagonals.push(getDiagonalToRightTop(x, 0, cols, rows))
  }
  for (let y = 1; y < rows; y++) {
    // left to right top
    diagonals.push(getDiagonalToRightTop(0, y, cols, rows))
  }

  for (let x = 0; x < cols; x++) {
    // bottom to left top
    diagonals.push(getDiagonalToLeftTop(x, 0, rows))
  }
  for (let y = 1; y < rows; y++) {
    // right to left top
    diagonals.push(getDiagonalToLeftTop(cols - 1, y, rows))
  }

  return diagonals
}

function getRows(cols, rows) {
  return new Array(rows)
    .fill(null)
    .map(
      (row, rowIndex) => new Array(cols)
        .fill(null)
        .map((cell, colIndex) => [colIndex, rowIndex])
    )
}

function getCols(cols, rows) {
  return new Array(cols)
    .fill(null)
    .map(
      (col, colIndex) => new Array(rows)
        .fill(null)
        .map((cell, rowIndex) => [colIndex, rowIndex])
    )
}

function getArrays(board) {
  const cols = board.length
  const rows = board[0].length
  return [
    ...getDiagonals(cols, rows),
    ...getRows(cols, rows),
    ...getCols(cols, rows)
  ]
    .filter(arr => arr.length >= 4)
    .map(arr => ({
      start: arr[0],
      end: arr[arr.length - 1],
      coordinates: arr,
      values: arr.map(([x, y]) => board[x][y])
    }))
}

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
