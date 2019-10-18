import React from "react"

class Piece extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <circle
        onClick={(e) => {this.props.selectPiece(e, this.props.location, this.props.player)}}
        cx={this.props.centerX}
        cy={this.props.centerY}
        fill={this.props.player === 1 || this.props.player === 3 ? "white" : "red"}
        r={this.props.player === 1 || this.props.player === 2 ? this.props.radius : this.props.radius*1.5 }
      />
    );
  }
}

export default Piece;