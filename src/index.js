import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends Component {
  renderSquare = (index) => {
    // pass the handleClick(index) func to Square so that 
    // a square element can call this function when clicked
    return <Square value={this.props.squares[index]} onClick={() => this.props.onClick(index)}/>;
  }

  render() {
    let status = 'Next player: ' + (this.props.player);
    const winner = calculateWinner(this.props.squares); 
    if(winner != null) {
      status = winner + ' win （￣︶￣）　';
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        Array(9).fill(null)
      ],
      stepNumber: 0,
      player: 'X'
    }
  }

  jumpTo = (step) => {
    this.setState({
      stepNumber: step,
      player: this.changePlayer(this.state.player)
    })
  }

  changePlayer = (currPlayer) => {
    if (currPlayer === 'X') {
      return 'O'
    } else {
      return 'X'
    }
  }

  handleClick = (index) => {
    // .slice() method create a copy of array this.state.square instead
    // of modifying the exsisting array
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const newBoard = current.slice();
    
    if (current[index] || calculateWinner(current)) {
      return;
    }
    newBoard[index] = this.state.player;
    history.push(newBoard);
    
    this.setState({
      history: history,
      stepNumber: history.length - 1,
      player: this.changePlayer(this.state.player)
    }, () => {
      console.log('hnadle click', history, current, this.state.stepNumber);
    });
  }

  render() {
    // update game status
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    console.log(history, this.state.stepNumber);
    let status = 'Next player: ' + (this.state.player);
    const winner = calculateWinner(current); 
    if(winner != null) {
      status = winner + ' win （￣︶￣）↗　';
    }

    // show history
    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return (
        <button key={move} onClick={() => this.jumpTo(move)}>{desc}</button>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current} player={this.state.player} onClick={(i) => this.handleClick(i)} />
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
  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  for (let index = 0; index < winningLines.length; index++) {
    let [a, b, c] = winningLines[index];
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
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
