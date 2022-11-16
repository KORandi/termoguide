import React from "react";

export class Button extends React.Component {
  render() {
    return (
      <button {...this.props} className={`button ${this.props.className}`}>
        {this.props.children}
      </button>
    );
  }
}
