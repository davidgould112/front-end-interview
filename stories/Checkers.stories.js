import React from "react";
import "./style.css";
import Space from "./Space.js"
import Piece from "./Piece.js"

// This is used by Storybook:
export default {
  title: "Checkers"
};

// This is the main app:
export const Checkers = () => {
  return <Board size={400} />;
};

class Board extends React.Component {
  constructor() {
    super() 
    this.state = {
        board: [
          [0, 1, 0, 1, 0, 1, 0, 1],
          [1, 0, 1, 0, 1, 0, 1, 0],
          [0, 1, 0, 1, 0, 1, 0, 1],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0],
          [2, 0, 2, 0, 2, 0, 2, 0],
          [0, 2, 0, 2, 0, 2, 0, 2],
          [2, 0, 2, 0, 2, 0, 2, 0]
        ],
        selectedPiece: null,
        whiteTeamActive: true,
        failedMoveCount: 0
    };

    this.selectPiece = this.selectPiece.bind(this)
    this.attemptMove = this.attemptMove.bind(this)
    this.checkGameOver = this.checkGameOver.bind(this)
  }

  componentDidMount () {
    alert ("\nThe player using the white pieces will start the game. \n\nSelect the piece you would like to move by clicking on it with the mouse. \n\nOnce a piece is selected, click on an empty space with the mouse to move the piece there.")
  }

  selectPiece(e, pieceLoc, player) {

    e.preventDefault()

    let allPieces = document.getElementsByTagName("circle");

    // warn if it wrong-colored piece is selected
    if (this.state.whiteTeamActive && player !== 1) {
      if (player !== 3) {
        alert("\n White Pieces Active")
      } 
    } else if (!this.state.whiteTeamActive && player !== 2) {
      if (player !== 4) {
        alert("\n Red Pieces Active") 
      }
    } 

    // reset color of selected piece when switching selected pieces
    for (var i = 0; i < allPieces.length; i++) {
      if (allPieces[i].attributes.fill.value === "pink") {
        allPieces[i].setAttribute("fill", "red");
      } else if (allPieces[i].attributes.fill.value === "tan") {
        allPieces[i].setAttribute("fill", "white");
      }
    }   
    
    // logic for changer fill color upon selection
    if((this.state.whiteTeamActive && player === 1) || (this.state.whiteTeamActive && player === 3)) {
      e.target.setAttribute("fill", "tan")
    } else if ((!this.state.whiteTeamActive && player === 2) || (!this.state.whiteTeamActive && player === 4)) {
      e.target.setAttribute("fill", "pink")
    }
    this.setState({selectedPiece: pieceLoc})
  }

  attemptMove(e, spaceLoc) {

    // warn player if they attempt to move without selecting a piece
    if (spaceLoc === undefined || this.state.selectedPiece === null) {
      alert("\nSelect a piece to move!")
      return
    }

    // logic for "attacking" move or two-square jump
    if (Math.abs(spaceLoc[0] - this.state.selectedPiece[0]) === 2 && Math.abs(spaceLoc[1] - this.state.selectedPiece[1]) === 2) {
      let skipPiece = [(spaceLoc[0] + this.state.selectedPiece[0])/2 , (spaceLoc[1] +this.state.selectedPiece[1])/2]; 
      let validSkip = ((Math.abs(skipPiece[0] - this.state.selectedPiece[0]) === 1) && (Math.abs(skipPiece[1] - this.state.selectedPiece[1]) === 1)) && this.state.board[skipPiece[0]][skipPiece[1]] !== 0;
      //if valid move, change board map to move selectedPiece and remove opposite team's piece
      if (validSkip) {
        let newBoard = this.state.board;
        // remove opposing player's piece 
        newBoard[skipPiece[0]][skipPiece[1]] = 0
        // set the selected space equal to value of selected piece 
        // -- includes logic to create a "King" when player gets to opposite side
        if (0 < spaceLoc[0] && spaceLoc[0] < 7) {
          newBoard[spaceLoc[0]][spaceLoc[1]] =  this.state.board[this.state.selectedPiece[0]][this.state.selectedPiece[1]]
        } else if (this.state.whiteTeamActive && spaceLoc[0] === 7) {
          newBoard[spaceLoc[0]][spaceLoc[1]] =  3
        } else if (!this.state.whiteTeamActive && spaceLoc[0] === 0) {
          newBoard[spaceLoc[0]][spaceLoc[1]] =  4
        }
        // clears value of space where selectedPiece once was
        newBoard[this.state.selectedPiece[0]][this.state.selectedPiece[1]] = 0
        // updates board
        this.setState({board: newBoard, selectedPiece: null})
        // checks to see if all pieces from opponent have been removed
        this.checkGameOver()
      } 
    }  

    // logic for single space move
    if ((Math.abs(spaceLoc[0] - this.state.selectedPiece[0]) === 1 && Math.abs(spaceLoc[1] - this.state.selectedPiece[1]) === 1) && (this.state.board[spaceLoc[0]][spaceLoc[1]] === 0)) {
      let newBoard = this.state.board;
      if (0 < spaceLoc[0] && spaceLoc[0] < 7) {
        newBoard[spaceLoc[0]][spaceLoc[1]] =  this.state.board[this.state.selectedPiece[0]][this.state.selectedPiece[1]]
      } else if (this.state.whiteTeamActive && spaceLoc[0] === 7) {
        newBoard[spaceLoc[0]][spaceLoc[1]] =  3
      } else if (!this.state.whiteTeamActive && spaceLoc[0] === 0) {
        newBoard[spaceLoc[0]][spaceLoc[1]] =  4
      }
      newBoard[this.state.selectedPiece[0]][this.state.selectedPiece[1]] = 0;
      this.setState({board: newBoard, whiteTeamActive: !this.state.whiteTeamActive, selectedPiece: null});
    } 

    return;
  }

  // check to see if this was the last of opponent's pieces
  checkGameOver () {
    
    if (this.state.whiteTeamActive) {
      let redPieces = document.getElementsByTagName("circle");
      redPieces = Array.from(redPieces);
      redPieces.map((piece) => {return piece.attributes.fill.value === "red"}).length === 0 ? alert ("\n**###!!!! White Wins !!!!###**") : null;
    } else if (!this.state.whiteTeamActive) {
      let whitePieces = document.getElementsByTagName("circle");
      whitePieces = Array.from(whitePieces);
      whitePieces.map((piece) => {return piece.attributes.fill.value === "white"}).length === 0 ? alert ("\n**###!!!! Red Wins !!!!###**") : null;
    }

    return 
  }


  render() {
    const spaceSize = this.props.size / 8;
    const pieceRadius = spaceSize / 2;

    return (
      <svg
        height={this.props.size}
        width={this.props.size}
        viewBox={`0 0 ${this.props.size} ${this.props.size}`}
      >
        {this.state.board.map((row, y) => {
          const isEvenRow = y % 2;
          const spaceY = spaceSize * y;

          return row.map((space, x) => {
            const isEvenSpace = x % 2;
            const spaceX = spaceSize * x;
            return (
              <Space
                attemptMove={this.attemptMove}
                key={x}
                shade={
                  (isEvenSpace && !isEvenRow) || (!isEvenSpace && isEvenRow)
                }
                space={space}
                size={spaceSize}
                x={spaceX}
                y={spaceY}
                location={[y,x]}
              />
            );
          });
        })}
        {this.state.board.map((row, y) => {
          const spaceY = spaceSize * y;

          return row.map((space, x) => {
            const spaceX = spaceSize * x;

            if (space === 0) {
              // The space is empty.
              return null;
            }

            return (
              <Piece
                selectPiece={this.selectPiece}
                key={x}
                centerX={spaceX + pieceRadius}
                centerY={spaceY + pieceRadius}
                player={space}
                location={[y, x]}
                radius={pieceRadius * 0.75}
              />
            );
          });
        })}
      </svg>
    );
  }
}




