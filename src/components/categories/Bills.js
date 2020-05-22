import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../../actions/authActions";

import { Doughnut} from 'react-chartjs-2';

class Bills extends Component {

  state = {
    user: this.props.auth,
    userId: this.props.auth.user.id,
    bills: [],
    name: "",
    dueDate: "",
    amount: "",
    addBill: false,
    editBill: false

  }

  componentDidMount() {
    this.getBills()
  }

  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  //fetch all bills for user
  getBills = () => {
    fetch('/api/bills/' + this.state.userId)
    .then(res => res.json())
    .then(jsonedBills => this.setState({bills: jsonedBills}))
    .catch( error => console.error(error))
  }


  // Post a new bill




    // Logout
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  //Form Conditionals

  handleOpenBillForm = () => {
    this.setState({addBill: true})
    this.handleCloseEditForm()
  }

  handleCloseBillForm = () => {
    this.setState({addBill: false})
  }

  handleEditForm = (bill) => {
    this.setState({
      editBill: true,
      addBill: false,
      billId: bill._id,
      name: bill.name,
      amount: bill.amount

    })
  }

  handleCloseEditForm = () => {
    this.setState({
      editBill: false,
      bill: "",
      name: "",
      dueDate: "",
      amount: ""
    })
  }





  
  render() {

    const { user } = this.props.auth;
    console.log(this.state.bills)
    return (
      <div>
        <div className="category-container">
            <Link to="/dashboard" className="btn waves-effect waves-light hoverable" id="dashboard-back-button">Back To Dashboard</Link>
            <button onClick={this.onLogoutClick} className="btn waves-effect waves-light hoverable" id="accounts-log-out-button">
              Logout
            </button>
            <h5 className="category-introduction">Here are your monthly recurring bills, {user.name.split(" ")[0]}.</h5>
            <button onClick={this.handleOpenBillForm} className="btn waves-effect waves-light hoverable" id="dashboard-back-button">
              Track a New Bill
            </button>
        </div>
        { this.state.addBill ?
          <div className="category-container">
            <div className="row">
              <form className="col s12" onSubmit={this.handleBillSubmit}>
                <div className="row">
                  <div className="input-field col s4">
                    <input type="text" id="name" name="name" className="validate" onChange={this.handleChange}/>
                    <label htmlFor="category">Category Name</label>
                  </div> 
                  <div className="input-field col s2">
                    <input type="text" id="dueDate" name="dueDate" className="validate" onChange={this.handleChange} />
                    <label htmlFor="dueDate">Due Date</label>
                  </div>
                  <div className="input-field col s2">
                    <input type="text" id="amount" name="amount" className="validate" onChange={this.handleChange} />
                    <label htmlFor="amount">Amount Due</label>
                  </div>
                  <input type="submit" className="btn" id="budget-form-button" value="Enter"/>
                  <button onClick={this.handleCloseBillForm} className="btn" id="budget-form-cancel-button">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
          :null }
          { this.state.editBill ?
          <div className="category-container">
            <div className="row">
              <form className="col s12" onSubmit={this.handleEditBillSubmit}>
                <div className="row">
                  <div className="input-field col s4">
                    <input type="text" id="name" name="name" className="validate" onChange={this.handleChange} value={this.state.name}/>
                  </div> 
                  <div className="input-field col s2">
                    <input type="text" id="dueDate" name="dueDate" className="validate" onChange={this.handleChange} value={this.state.dueDate}/>
                  </div>
                  <div className="input-field col s2">
                    <input type="text" id="amount" name="amount" className="validate" onChange={this.handleChange} value={this.state.amount}/>
                  </div>
                  <input type="submit" className="btn" id="budget-form-button" value="Submit"/>
                  <button onClick={this.handleCloseEditBillForm} className="btn" id="budget-form-cancel-button">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
          :null }
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