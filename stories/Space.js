import React from "react"

class Space extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <rect
        onClick={(e) => {this.props.attemptMove(e, this.props.location)}}
        fill={this.props.shade ? "green" : "lightgray"}
        height={this.props.size}
        width={this.props.size}
        x={this.props.x}
        y={this.props.y}
      />
    );
  }
}

export default Space