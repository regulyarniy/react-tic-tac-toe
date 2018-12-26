import React from 'react';
import Board from './board';

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i += 1) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(``),
      }],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleClick(i, row, col) {
    const { history, stepNumber, xIsNext } = this.state;
    const newHistory = history.slice(0, stepNumber + 1);
    const current = newHistory[stepNumber];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = xIsNext ? `X` : `O`;
    this.setState({
      history: newHistory.concat([{ squares, row, col }]),
      stepNumber: newHistory.length,
      xIsNext: !xIsNext,
    });
  }

  render() {
    const { history, stepNumber, xIsNext } = this.state;
    const current = history[stepNumber];
    const winner = calculateWinner(current.squares);
    const status = winner
      ? `Winner ${winner}`
      : `Next player: ${xIsNext ? `X` : `O`}`;
    const moves = history.map((moveState, moveIndex) => {
      const desc = moveIndex
        ? `Go to move #${moveIndex} (col:${moveState.col},row:${moveState.row})`
        : `Go to game start`;
      const isCurrent = moveIndex === stepNumber;
      const moveClass = isCurrent ? `current` : ``;
      return (
        <li className={moveClass} key={moveState.squares.join(``)}>
          <button type="button" onClick={() => this.jumpTo(moveIndex)}>{desc}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i, row, col) => this.handleClick(i, row, col)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
