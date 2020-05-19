import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from "../../img/electrumlogo.png";

class Navbar extends Component {
  render() {
    return (
      <div className="navbar-fixed">
        <Link to="/" style={{fontFamily: "monospace"}}>
          <img src={logo} style={{ height: "62px", paddingLeft: '5px' }} alt="Undraw" />
        </Link>
      </div>
    );
  }
}
export default Navbar;