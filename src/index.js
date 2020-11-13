import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FiCircle, FiX } from 'react-icons/fi';

import './index.css';

function Icon(props) {
  let icon = null;

  if (props === 'O') { icon = <FiCircle size={100} /> } 
  else if (props === 'X') { icon = <FiX size={100} /> }

  return icon;
}

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {Icon(props.value)}
    </button>
  )
}

function PopUpMenu(props) {
  return(
    <Card className="blurry-bg">
      <Card.Body className="floating borRad">
        <Card.Title className="text-center m-2">{props.winner} has won the game</Card.Title>
        <Button variant="danger" size="lg" className="align-content-between mx-5" onClick={props.onClick}> RESTART </Button>
      </Card.Body>
    </Card>
  ); 
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
      status = winner + ' win $$$';
    } else if (isFull(this.props.squares)) {
      status += ' (board is full, auto refresded ↺)';
    }

    return (
      <Container className="m-5">
        <h2 className="status">{status}</h2>
        <Row className="m-0">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </Row>
        <Row className="m-0">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </Row>
        <Row className="m-0">
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
      isXTurn: true,
      showPopUp: false
    }

    setInterval(() => {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];

      if (calculateWinner(current)) {
        this.setState({ showPopUp: true });
        return;
      }

      if (isFull(current)) {
        const newBoard = current.slice();
        newBoard.fill(null);
        history.push(newBoard);
        
        this.setState({
          history: history,
          stepNumber: history.length - 1,
          showPopUp: false
        });
      }
    }, 1000);
  }

  jumpTo = (step) => {
    this.setState({
      stepNumber: step,
      isXTurn: (step % 2) === 0,
      showPopUp: false
    })
  }

  handleClick = (index) => {
    // .slice() method create a copy of array this.state.square instead
    // of modifying the exsisting array
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const newBoard = current.slice();
    let playerTurn = this.state.isXTurn;

    if (current[index] || calculateWinner(current) || isFull(current)) { return; }
    newBoard[index] = this.state.isXTurn ? 'X' : 'O';

    history.push(newBoard);
    
    this.setState({
      history: history,
      stepNumber: history.length - 1,
      isXTurn: !playerTurn
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
      const desc = move ? 'Go to move #' + move : 'Restart game ↺';
      return (
        <button key={move} onClick={() => this.jumpTo(move)} disabled={move === this.state.stepNumber}>{desc}</button>
      );
    });

    return (
      <Container className="h-100 w-100 justify-content-between" fluid="sm">
        <Row>
          <Col sm={8} className="bg-primary m-1 p-auto h-100 borRad">
            <Board squares={current} player={currentPlayer} onClick={(i) => this.handleClick(i)} />
          </Col>
          <Col sm={3} className="bg-secondary m-1 p-3 h-100 borRad">
            <h3> Traverse between moves: </h3>
            <ol>{moves}</ol>
          </Col>
        </Row>
        {this.state.showPopUp
          ? <PopUpMenu 
            winner={this.state.isXTurn ? 'O' : 'X'} 
            onClick={() => {
              this.setState({
                history: [Array(9).fill(null)],
                stepNumber: 0,
                isXTurn: true,
                showPopUp: false
              })
            }
            }>
          </PopUpMenu>  
          : null
        }
      </Container>
    );
  }
}

function isFull(squares) {
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
