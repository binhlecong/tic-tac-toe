import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import { XCircle, CircleFill } from 'react-bootstrap-icons' 

import './index.css';

function Icon(props) {
  let icon = null;
  if (props === 'O') {
    icon = <CircleFill size={100} /> 
  } else if (props === 'X') {
    icon = <XCircle size={100} />
  }
  return icon;
}

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {Icon(props.value)}
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
    
    if (winner != null) {
      status = winner + ' win （￣︶￣）　';
    }
    
    if (isDraw(this.props.squares)) {
      status = "It 's a draw o(*^＠^*)o";
    }

    return (
      <Container className="m-3">
        <h2 className="status">{status}</h2>
        <Row>
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </Row>
        <Row className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </Row>
        <Row className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </Row>
      </Container>
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
      isXTurn: true
    }
  }

  jumpTo = (step) => {
    this.setState({
      stepNumber: step,
      isXTurn: (step % 2) === 0
    })
  }

  handleClick = (index) => {
    // .slice() method create a copy of array this.state.square instead
    // of modifying the exsisting array
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const newBoard = current.slice();
    
    if (current[index] || calculateWinner(current) || isDraw(current)) {
      return;
    }
    newBoard[index] = this.state.isXTurn ? 'X' : 'O';
    history.push(newBoard);
    
    this.setState({
      history: history,
      stepNumber: history.length - 1,
      isXTurn: !this.state.isXTurn
    }, () => {
      console.log('hnadle click', history, current, this.state.stepNumber);
    });
  }

  render() {
    // update game status
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    console.log(history, this.state.stepNumber);

    const currentPlayer = this.state.isXTurn ? 'X' : 'O';
    // let status = 'Next player: ' + currentPlayer;
    //const winner = calculateWinner(current); 
    // if(winner != null) {
    //   status = winner + ' win （￣︶￣）↗　';
    // }

    // show history
    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return (
        <button key={move} onClick={() => this.jumpTo(move)} disabled={move === this.state.stepNumber}>{desc}</button>
      );
    });

    return (
      <Container className="h-100 w-100" fluid="md">
        <Row>
          <Col md={7} className="bg-primary m-1 h-100">
            <Board squares={current} player={currentPlayer} onClick={(i) => this.handleClick(i)} />
          </Col>
          <Col md={4} className="bg-secondary m-1 h-100">
            <h3> Traverse between moves: </h3>
            <ol>{moves}</ol>
          </Col>
        </Row>
      </Container>
    );
  }
}

function isDraw(squares) {
  for (let index = 0; index < squares.length; index++) {
    if (squares[index] === null) {
      return false;
    }
  }
  return true;
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
  <Game/>,
  document.getElementById('root')
);
