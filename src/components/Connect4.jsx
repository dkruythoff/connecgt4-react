import React, { useState, useEffect } from 'react';
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
  const [highlightedColumn, setHighlightedColumn] = useState(null)
  const [touchEnabled, setTouchEnabled] = useState(false)

  const gameIsWon = !!game.winner
  const { freeIndexPerColumn } = game

  const handleColumnTouchend = (columnIndex) => {
    setTouchEnabled(true)

    if (gameIsWon || freeIndexPerColumn[columnIndex] === -1) {
      return
    }

    if (highlightedColumn !== columnIndex) {
      setHighlightedColumn(columnIndex)
    } else {
      game.makeMove(columnIndex)
      setHighlightedColumn(null)
    }

  }
  const handleColumnClick = (columnIndex) => {
    setTouchEnabled(false)

    if (gameIsWon || freeIndexPerColumn[columnIndex] === -1) return

    if (touchEnabled) {
      setTouchEnabled(false)
    } else {
      game.makeMove(columnIndex)
    }
  }

  return (
    <div
      className={gameClasses(gameIsWon)}>
      <Board
        game={game}
        highlightedColumn={highlightedColumn}
        handleColumnTouchend={handleColumnTouchend}
        handleColumnClick={handleColumnClick}
      />
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
