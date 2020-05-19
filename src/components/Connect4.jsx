import React, { useState } from 'react';
import classnames from 'classnames'
import { play } from 'connect4-core'

const defaultProps = {
  cols: 7,
  rows: 6
}

function Connect4({
  cols = defaultProps.cols,
  rows = defaultProps.rows
} = defaultProps) {

  const [gameState, setGameState] = useState(play({ cols, rows }))
  // useReducer(gameStateReducer, play({ cols, rows }))
  const [highlightedColumn, setHighlightedColumn] = useState(null)
  const [touchEnabled, setTouchEnabled] = useState(false)

  const makeMove = (columnIndex) => {
    setGameState(play(gameState, columnIndex))
    // dispatch({type: 'makeMove', columnIndex })
  }

  const columnIsPlayable = (columnIndex) => {
    return !(gameState.gameover || !gameState.columnsPlayable[columnIndex])
  }

  const handleColumnTouchend = (columnIndex) => {
    setTouchEnabled(true)

    if (!columnIsPlayable(columnIndex)) {
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
    if(touchEnabled) {
      setTouchEnabled(false)
      return
    }

    if (!columnIsPlayable(columnIndex)) return

    if (touchEnabled) {
      setTouchEnabled(false)
    } else {
      makeMove(columnIndex)
    }
  }

  const startGame = () => {
    setGameState(play({cols,rows}))
    // dispatch({type: 'reset'})
  }

  return (
    <div
      className={gameClasses(gameState.gameover)}>
      <Board
        gameState={gameState}
        highlightedColumn={highlightedColumn}
        handleColumnTouchend={handleColumnTouchend}
        handleColumnClick={handleColumnClick}
      />
      {
        gameState.gameover ?
          <Win
            gameState={gameState}
            startGame={startGame}
            /> :
          null
      }
    </div>
  )
}

function Board({ gameState, highlightedColumn, handleColumnTouchend, handleColumnClick }) {
  const { board, turn, gameover } = gameState

  return (
    <div className={boardClasses(gameover, turn)}>
      {
        board.map((column, columnIndex) => (
          <BoardColumn
            key={`board-column-${columnIndex}`}
            column={column}
            columnIndex={columnIndex}
            gameState={gameState}
            handleColumnTouchend={handleColumnTouchend}
            handleColumnClick={handleColumnClick}
            highlightedColumn={highlightedColumn}
          >
            {
              column.map((cell, cellIndex) => (
                <BoardCell
                  key={`board-column-${columnIndex}-cell-${cellIndex}`}
                  cell={cell}
                  cellIndex={cellIndex}
                  columnIndex={columnIndex}
                />
              ))
            }
          </BoardColumn>
        ))
      }
    </div>
  )
}

function BoardColumn({
  children,
  columnIndex,
  gameState,
  handleColumnTouchend,
  handleColumnClick,
  highlightedColumn
}) {
  const { columnsPlayable, turn } = gameState

  return (
    <div
      className={columnClasses(columnIndex, columnsPlayable, highlightedColumn)}
      key={`board-column-${columnIndex}`}
      onTouchEnd={() => handleColumnTouchend(columnIndex)}
      onClick={() => handleColumnClick(columnIndex)}
    >
      { children }
      <div className="cell cell--preview">
        <span className={pieceClasses(turn)}>&nbsp;</span>
      </div>
    </div>
  )
}

function BoardCell({
  cell,
  cellIndex,
  columnIndex
}) {
  return (
    <div
      className={cellClasses(cell.value)}
      key={`board-column-${columnIndex}-cell-${cellIndex}`}
    >
      <span className={pieceClasses(cell.value)}>&nbsp;</span>
    </div>
  )
}

function Win({gameState,startGame}) {
  const {turn} = gameState
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
