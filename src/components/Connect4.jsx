import React, { useState } from 'react';
import classnames from 'classnames'
import { Connect4 as Connect4Core } from '../lib/Connect4'

const defaultProps = {
  cols: 7,
  rows: 6
}

function Connect4({
  cols = defaultProps.cols,
  rows = defaultProps.rows
} = defaultProps) {

  const [game, setGame] = useState(new Connect4Core(cols, rows))
  const [, setTurn] = useState(game.turn)
  const [highlightedColumn, setHighlightedColumn] = useState(null)
  const [touchEnabled, setTouchEnabled] = useState(false)
  const [gameover,setGameover] = useState(!!game.winner)

  const makeMove = (columnIndex) => {
    game.makeMove(columnIndex)
    setGameover(!!game.winner)
    setTurn(game.turn) // force rerender
  }

  const handleColumnTouchend = (columnIndex) => {
    setTouchEnabled(true)

    if (gameover || game.freeIndexPerColumn[columnIndex] === -1) {
      return
    }

    if (highlightedColumn !== columnIndex) {
      setHighlightedColumn(columnIndex)
    } else {
      setHighlightedColumn(null)
      makeMove(columnIndex)
    }

  }
  const handleColumnClick = (columnIndex) => {
    setTouchEnabled(false)

    if (gameover || game.freeIndexPerColumn[columnIndex] === -1) return

    if (touchEnabled) {
      setTouchEnabled(false)
    } else {
      makeMove(columnIndex)
    }
  }

  const startGame = () => {
    setGame(new Connect4Core(cols, rows))
    setGameover(false)
    setTurn(0)
  }

  return (
    <div
      className={gameClasses(gameover)}>
      <Board
        game={game}
        highlightedColumn={highlightedColumn}
        handleColumnTouchend={handleColumnTouchend}
        handleColumnClick={handleColumnClick}
      />
      {
        gameover ?
          <Win
            game={game}
            startGame={startGame}
            /> :
          null
      }
    </div>
  )
}

function Board({ game, highlightedColumn, handleColumnTouchend, handleColumnClick }) {
  const { board, turn, freeIndexPerColumn, winner } = game
  const gameIsWon = !!winner

  return (
    <div className={boardClasses(gameIsWon, turn)}>
      {
        board.map((column, columnIndex) => (
          <div
            className={columnClasses(columnIndex, freeIndexPerColumn, highlightedColumn)}
            key={`board-column-${columnIndex}`}
            onTouchEnd={() => handleColumnTouchend(columnIndex)}
            onClick={() => handleColumnClick(columnIndex)}
          >
            {
              column.map((cell, cellIndex) => (
                <div
                  className={cellClasses(cell)}
                  key={`board-column-${columnIndex}-cell-${cellIndex}`}
                  >
                  <span className={pieceClasses(cell)}>&nbsp;</span>
                </div>
              ))
            }
            <div className="cell cell--preview">
              <span className={pieceClasses(turn)}>&nbsp;</span>
            </div>
          </div>
        ))
      }
    </div>
  )
}

function Win({game,startGame}) {
  const {turn} = game
  const turnName = turn === 1 ? 'Red' : 'Yellow'

  return (
    <div className="won">
      <p>{turnName} wins!</p>
      <button className="startgame" onClick={startGame}>Play again</button>
    </div >
  )
}

function gameClasses(gameIsWon) {
  return classnames({
    'game': true,
    'game--over': gameIsWon
  })
}

function boardClasses(gameIsWon, turn) {
  return classnames({
    'board': true,
    'board--playable': !gameIsWon,
    'board--turn-1': turn === 1,
    'board--turn-2': turn === 2
  })
}

function columnClasses(columnIndex, freeIndexPerCol, highlightedColumn) {
  return classnames({
    'column': true,
    'column--full': freeIndexPerCol[columnIndex] === -1,
    'column--highlighted': highlightedColumn === columnIndex
  })
}

function cellClasses(cell) {
  return classnames({
    'cell': true,
    'cell--winner': false // FIXME
  })
}

function pieceClasses(cell = null) {
  return classnames({
    'piece': true,
    'piece--1': cell === 1,
    'piece--2': cell === 2
  })
}

export default Connect4
