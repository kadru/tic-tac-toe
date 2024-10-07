import { useState } from 'react';
import './App.css'

const indexMapPos = [
  [0,0],
  [0,1],
  [0,3],
  [1,0],
  [1,1],
  [1,2],
  [2,0],
  [2,1],
  [2,2]
];

function Square({ value, onSquareClick, winner }) {
  return <button className={ "square " + (winner ? 'winner' : '')}
                 onClick={onSquareClick}>
                 {value}
         </button>;
}

function Board({xIsNext, squares, onPlay}) {
  const [winner, winnerLine] = calculateWinnerLines(squares);
  const draw = squares.every((square) => square !== null) && winnerLine === null

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function handleClick(index) {
    const [winner] = calculateWinnerLines(squares)
    if (squares[index] || winner) {
      return
    }
    const nextSquares = squares.slice()
    if(xIsNext) {
      nextSquares[index] = "X"
    } else {
      nextSquares[index] = "O"
    }
    onPlay(nextSquares, index)
  }

  return <>
     <div className="status">{status}</div>
      {[0, 3, 6].map((pivot) => {
        return(
          <div key={pivot} className="board-row">
            {squares.slice(pivot, pivot + 3).map((square, index) => {
               const squareIndex = pivot + index
               return(
                 <Square key={squareIndex}
                         winner={winnerLine && winnerLine.includes(squareIndex)}
                         value={square}
                         onSquareClick={() => handleClick((squareIndex))}/>
               )
            })}
          </div>)
      })}
      <div className="game-info">
        {draw && "Draw"}
      </div>
   </>
}

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0)
  const [reverse, setReverse] = useState(false)
  const [historyPosition, setHistoryPostition] = useState([])
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove]

  function handlePlay(nextSquares, index){
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1);
    setHistoryPostition([...historyPosition, index]);
  }

  function jumpTo(nextMove){
    setCurrentMove(nextMove)
  }

  function handleReverseClick() {
    setReverse(!reverse)
  }

  const moves = history.map((squares, move) => {
    let description;
    if(move) {
      description = `Go to move # ${move} ${indexMapPos[historyPosition[move - 1]]}`
    } else {
      description = 'Go to game start'
    }
  
    if (move == currentMove) {
      return(
        <li key={move}>
          {description}
        </li>
      )
    }

    return(
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <div className="game-info">
          <button onClick={handleReverseClick}>Reverse</button>
        </div>
        <ol>{reverse ? moves.toReversed() : moves}</ol>
      </div>
    </div>
  )
}

function App() {
  return <Game/>
}

function calculateWinnerLines(squares) {
  const lines = [
    [0, 1, 2], // positions where there are a winner
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return [null, null];
}

export default App
