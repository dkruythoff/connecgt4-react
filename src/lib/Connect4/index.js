import { getWinner } from './winner'
import { getBoard, getBoardWithMoves, getBoardWithWinners, getFreeIndexPerColumn } from './board'
import { getLines as getArrays } from './lines'

// the old

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

// the new

const defaultState = {
  cols: 7,
  rows: 6,
  moves: [],
  turn: 1
}
export function play({
  cols = defaultState.cols,
  rows = defaultState.rows,
  moves = defaultState.moves,
  turn = defaultState.turn
} = defaultState, playColumn) {

  let nextTurn = turn
  let newMoves = [...moves]
  let board = getBoard(cols, rows)
  let gameover = false

  if (moves.length) board = getBoardWithMoves(board, moves)

  const freeIndexPerColumn = getFreeIndexPerColumn(board)

  if (playColumn !== undefined && freeIndexPerColumn[playColumn] !== -1) {
    newMoves = moves.concat([playColumn, freeIndexPerColumn[playColumn], turn])
    board = getBoardWithMoves(board, moves)
    const winner = getWinner(board, turn)
    nextTurn = turn === 1 ? 2 : 1

    if (!!winner) {
      board = getBoardWithWinners(board, winner.winningCoordinates)
      gameover = true
    }
  }

  return {
    board,
    gameover,
    moves: newMoves,
    turn: nextTurn
  }
}
