import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../../actions/authActions";


class Bills extends Component {

    // Logout
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };



  
  render() {
    const { user } = this.props.auth;
    console.log(user)
    return (
        <div className="category-container">
            <Link to="/dashboard" className="btn waves-effect waves-light hoverable" id="dashboard-back-button">Back To Dashboard</Link>
            <button onClick={this.onLogoutClick} className="btn waves-effect waves-light hoverable" id="accounts-log-out-button">
              Logout
            </button>
            <h5 className="category-introduction">Here are your monthly recurring bills, {user.name.split(" ")[0]}.</h5>
        </div>
    );
  }
}

Bills.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(Bills);