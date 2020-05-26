import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../../actions/authActions";

import { getAccounts, getTransactions } from "../../actions/accountActions";

import Banking from "./Banking";

class Expenses extends Component {


  componentDidMount() {
    this.props.getAccounts();
  }

  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };
  
  // Logout
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };
  
  render() {
    const { user } = this.props.auth;
    console.log(user.name)

    const { accounts } = this.props.plaid;
    console.log(accounts)

    // const { accounts, accountsLoading } = this.props.plaid;
    // console.log(this.state.accounts)

    // const transactions = this.props.plaid;
    // console.log(transactions)

    return (
      <div>
        <div className="category-container">
            <Link to="/dashboard" className="btn waves-effect waves-light hoverable" id="dashboard-back-button">Back To Dashboard</Link>
            <button onClick={this.onLogoutClick} className="btn waves-effect waves-light hoverable" id="accounts-log-out-button">
              Logout
            </button>
        </div>
        <div className="category-container" id="expenses-component-main-container">
          <Banking user={user} accounts={accounts} />
        </div>
      </div>
    );
  }
}

Expenses.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  getAccounts: PropTypes.func.isRequired,
  plaid: PropTypes.object.isRequired,
  getTransactions: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  plaid: state.plaid
});

export default connect(
    mapStateToProps,
    { logoutUser, getAccounts, getTransactions }
)(Expenses);