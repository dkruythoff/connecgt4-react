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

export function getLines(board) {
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
      values: arr.map(([x, y]) => board[x][y].value)
    }))
}
