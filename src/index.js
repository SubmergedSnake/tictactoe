
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { throwStatement } from '@babel/types';


class ToggleBtn extends React.Component {

    render() {
        return (
            <div><button onClick={this.props.onClick}> Flip order</button></div>
        )
    }
}

class Square extends React.Component {

    render() {
        let button = this.props.highlight === true ? <button id={"btn" + this.props.id} style={{ background: 'orange' }} className="square" onClick={this.props.onClick} >
            {this.props.value}
        </button>
            :
            <button id={"btn" + this.props.id} className="square" onClick={this.props.onClick} >
                {this.props.value}
            </button>;

        return (
            button
        );
    }
}

class Board extends React.Component {



    renderSquare(i, col, row, winner) {

        return (
            <Square
                col={this.props.col}
                row={this.props.row}
                value={this.props.squares[i]}
                highlight={winner}
                id={i}
                onClick={() => this.props.onClick(i, col, row)}
            />
        );
    }

    renderSquares = () => {
        var winners = this.props.winningSquares;
        let rows = [];
        let sqrno = 0;
        for (let i = 0; i < 3; i++) {
            let squares = [];
            for (let j = 0; j < 3; j++) {
                if (winners) {
                    squares.push(this.renderSquare(sqrno, j, i, winners.includes(sqrno)));
                    sqrno++;
                } else {
                    squares.push(this.renderSquare(sqrno, j, i, 'false'));
                    sqrno++;
                }
            }
            rows.push(<div id={"div" + i} className="board-row">{squares}</div>)
        }
        return rows;
    }

    render() {
        return (
            <div>
                {this.renderSquares()}
            </div>
        );
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [{
                id: 0,
                squares: Array(9).fill(null),
                col: null,
                row: null,
                historyText: 'Go to game start'
            }],
            xIsNext: true,
            stepNumber: 0,
            currentlySelected: 0,
            moveListAsc: true,

        };
    }

    flipList = () => {
        this.setState({
            moveListAsc: !this.state.moveListAsc,
            history: this.state.history.reverse(),
        })
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
                id: history.length,
                squares: squares,
                col: col + 1,
                row: row + 1,
                historyText: 'Go to move ' + (this.state.stepNumber + 1) + ' (col ' + (col + 1) + '), (row ' + (row + 1) + ')',
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            currentlySelected: history.length,
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
        const winningSquares = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            return (
                <li key={step.id}>
                    <button onClick={() => this.jumpTo(step.id)}>{step.id === this.state.currentlySelected ? <b>{step.historyText}</b> : step.historyText}</button>
                </li>
            )
        })

        let status;
        if (winningSquares) {
            status = 'Winner: ' + current.squares[winningSquares[0]];
        } else if (!winningSquares && history.length == 10){
            status = 'A draw.';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        console.log(history.length);
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        winningSquares={winningSquares}
                        squares={current.squares}
                        onClick={(i, col, row) => this.handleClick(i, col, row)} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
                <ToggleBtn onClick={this.flipList} />
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
            return lines[i];
        }
    }
    return null;
}

