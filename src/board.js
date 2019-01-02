import React from 'react';
import PropTypes from 'prop-types';

const Square = (props) => {
  const { onClick, value, win } = props;
  return (
    <button
      type="button"
      className={`square ${win ? `square--win` : ``}`}
      onClick={onClick}
    >
      {value}
    </button>
  );
};

Square.propTypes = {
  onClick: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  win: PropTypes.bool.isRequired,
};

const Row = (props) => {
  const { squares } = props;
  return (
    <div
      className="board-row"
    >
      {squares}
    </div>
  );
};

Row.propTypes = {
  squares: PropTypes.arrayOf(React.Component).isRequired,
};

export default class Board extends React.Component {
  renderSquare(i, row, col) {
    const { squares, onClick } = this.props;
    const isWin = squares[i].includes(`W`);
    return (
      <Square
        key={i}
        win={isWin}
        value={squares[i].slice(0, 1)}
        onClick={() => onClick(i, row, col)}
      />
    );
  }

  static renderRow(i, squares) {
    return (
      <Row
        key={i}
        squares={squares}
      />
    );
  }

  render() {
    const ROW_COUNT = 3;
    const COLUMN_COUNT = 3;
    const rows = [];
    for (let i = 0; i < ROW_COUNT; i += 1) {
      const squares = [];
      for (let j = i * ROW_COUNT; j < i * ROW_COUNT + COLUMN_COUNT; j += 1) {
        squares.push(this.renderSquare(j, i + 1, squares.length + 1));
      }
      rows.push(Board.renderRow(i, squares));
    }
    return (
      <div>
        {rows}
      </div>
    );
  }
}

Board.propTypes = {
  squares: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClick: PropTypes.func.isRequired,
};
