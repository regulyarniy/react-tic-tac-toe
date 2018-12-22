import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
        return (
            <button
                className="square"
                onClick={props.onClick}
            >
                {props.value}
            </button>
        );
}

function Row(props) {
    return (
        <div
            className="board-row"
        >
            {props.squares}
        </div>
    )
}

class Board extends React.Component {

    renderSquare(i, row, col) {
        return <Square
            key={i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i, row, col)}
        />;
    }

    renderRow(i, squares) {
        return <Row
            key={i}
            squares={squares}
            />;
    }

    render() {
        const ROW_COUNT = 3;
        const COLUMN_COUNT = 3;
        const rows = [];
        for (let i = 0; i < ROW_COUNT; i++) {
            const squares = [];
            for (let j = i*ROW_COUNT; j < i*ROW_COUNT+COLUMN_COUNT; j++) {
                squares.push(this.renderSquare(j, i + 1, squares.length + 1));
            }
            rows.push(this.renderRow(i,squares));
        }
        return (
            <div>
                {rows}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0,
        }
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    handleClick(i, row, col) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? `X` : `O`;
        this.setState({
            history: history.concat([{squares, row, col}]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    render() {
        const {history} = this.state;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const status = winner ?
            `Winner ${winner}` :
            `Next player: ${this.state.xIsNext ? `X` : `O`}`;
        const moves = history.map((moveState, moveIndex) => {
            const desc = moveIndex ?
                `Go to move #${moveIndex} (col:${moveState.col},row:${moveState.row})` :
                `Go to game start`;
            return (
                <li key={moveIndex}>
                    <button onClick={() => this.jumpTo(moveIndex)}>{desc}</button>
                </li>
            );
        });

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i, row, col) => this.handleClick(i, row ,col)}
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

function calculateWinner(squares) {
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
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);


