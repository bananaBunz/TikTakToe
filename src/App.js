import React from 'react';
import './App.css';
import ReactDOM from 'react-dom';

import { v4 as uuidv4 } from 'uuid';

let gameSize = 3;

class App extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(gameSize * gameSize).fill(null),
            }],
            xTurn: true,
            stepNumber: 0,
        }
    }

    handleClick(i) {

        console.log(uuidv4());

        const history = this.state.history.slice(0, this.state.stepNumber+1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if(calcWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.state.xTurn ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xTurn: !this.state.xTurn,
        });
    }

    jumpTo(step){

        this.setState({
            stepNumber: step,
            xTurn: (step % 2 ) === 0,
        });
    }

    handleChangeGameSize(size){
        gameSize = size;
        this.setState(

        )
        renderApp();
    }

    render(){

        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calcWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move:
                'Go to game start';
            return (<li key={move}>
                <button className="move-button" onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>);
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xTurn ? 'X' : 'O');
        }

        let game =
                <div>
                    <div className="top">
                        <button className="move-button" onClick={()=> {
                            this.handleChangeGameSize(3)
                        }}>3X3</button>
                        <button className="move-button" onClick={()=> {
                            this.handleChangeGameSize(5)
                        }}>5x5</button>
                        <button className="move-button"onClick={()=>
                        {
                            this.handleChangeGameSize(9)
                        }}>9x9</button>
                    </div>
                    <div  className="game">
                        <div className="game-board">
                            <div className="game-status">{status}</div>
                            <Board squares={current.squares}
                                   onClick={(i) => this.handleClick(i)}/>
                        </div>
                        <div className="game-info">
                            <ol className="move-list">{moves}</ol>
                        </div>
                    </div>
                </div>;
        return game;
    }

}

class Board extends React.Component{
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }
    render() {
        let board =
            <div>
                {this.createSquares()}
            </div>;
        return board;
    }

    createSquares(){

        let rows = [];
        for(let i = 0; i < gameSize; i++){
            let squares = [];
            for(let j = 0; j < gameSize; j++){
                squares.push(this.renderSquare(gameSize*i+j));
            }
            rows.push(<div className="board-row">{squares}</div>)
        }
        return rows;


    }

}

function Square(props){
    return(
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function calcWinner(squares){

    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
            return squares[a];
        }
    }
    return null;
}

function renderApp(){
    ReactDOM.render(
        <App />,
        document.getElementById('root')
    )
}

export default App;