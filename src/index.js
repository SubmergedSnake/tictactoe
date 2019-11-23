
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class Square extends React.Component {

    render() {
        return (
            <button className="square" onClick={this.props.onClick} >
                {this.props.value}
            </button>
        );
    }
}

class Board extends React.Component {

    renderSquare(i, col, row) {
        return (
            <Square
                col={this.props.col}
                row={this.props.row}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i, col, row)}
            />
        );
    }

    render() {

        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0, 1, 1)}
                    {this.renderSquare(1, 2, 1)}
                    {this.renderSquare(2, 3, 1)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3, 1, 2)}
                    {this.renderSquare(4, 2, 2)}
                    {this.renderSquare(5, 3, 2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6, 1, 3)}
                    {this.renderSquare(7, 2, 3)}
                    {this.renderSquare(8, 3, 3)}
                </div>
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
                col: null,
                row: null
            }],
            xIsNext: true,
            stepNumber: 0,
            currentlySelected: 0
        };
    }

    handleClick(i, col, row) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                col: col,
                row: row, 
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            currentlySelected: this.state.stepNumber +1,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            currentlySelected: step
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + ' ' + step.col + ', ' + step.row :
                'Go to game start';
            return (
                <li key={move}>
        <button onClick={() => this.jumpTo(move)}>{this.state.currentlySelected === move ? <b>{desc}</b> : desc}</button>
                </li>
            )
        })

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i, col, row) => this.handleClick(i, col, row)} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

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
