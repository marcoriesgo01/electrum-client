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
    homeBills: [],
    transportationBills: [],
    subscriptionsBills: [],
    name: "",
    dueDate: "",
    categoryId: 0,
    amount: "",
    addBill: false,
    editBill: false

  }

  componentDidMount() {
    this.getBills()
    this.getHomeBills()
    this.getTransportationBills()
    this.getSubscriptionsBills()
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

  //get home bills
  //fetch all bills for user
  getHomeBills = () => {
    fetch('/api/bills/' + this.state.userId + "/1")
    .then(res => res.json())
    .then(jsonedHomeBills => this.setState({homeBills: jsonedHomeBills}))
    .catch( error => console.error(error))
  }

  //get home bills
  //fetch all bills for user
  getTransportationBills = () => {
    fetch('/api/bills/' + this.state.userId + "/2")
    .then(res => res.json())
    .then(jsonedTransportationBills => this.setState({transportationBills: jsonedTransportationBills}))
    .catch( error => console.error(error))
  }

  //get home bills
  //fetch all bills for user
  getSubscriptionsBills = () => {
    fetch('/api/bills/' + this.state.userId + "/3")
    .then(res => res.json())
    .then(jsonedSubscriptionsBills => this.setState({subscriptionsBills: jsonedSubscriptionsBills}))
    .catch( error => console.error(error))
  }


  // Post a new bill
  handleBillSubmit = (event) => {
    event.preventDefault()
    fetch('/api/bills/create',{
    body: JSON.stringify({
      userId: this.state.userId,
      name: this.state.name,
      dueDate: this.state.dueDate,
      categoryId: this.state.categoryId,
      amount: this.state.amount
    }),
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    }
  })
  .then(res => {
    this.setState({
        name: '',
        dueDate: '',
        categoryId: 0,
        amount: ''
    })
  })
  .then(this.handleCloseBillForm)
  .then(this.getBills)
  .then(this.getHomeBills)
  .then(this.getTransportationBills)
  .then(this.getSubscriptionsBills)
  .catch(error => console.error({ Error: error }));
}




    // Logout
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  //Form Conditionals

  handleOpenBillForm = (id) => {
    this.setState({categoryId: id, addBill: true})
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
      dueDate: bill.dueDate,
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

  //delete a bill
  deleteBill = id => {
    fetch('/api/bills/' + id, {
      method: 'DELETE'
    }).then( res => {
      const billsArr = this.state.bills.filter( bill => {
        return bill.id !== id
      })
      this.setState({
        bills: billsArr
      })
    }).then(this.getBills())
    .then(this.getHomeBills)
    .then(this.getTransportationBills)
    .then(this.getSubscriptionsBills)
  }

  //submit an edit to a bill
  handleEditBillSubmit = () => {
    fetch('/api/bills/' + this.state.billId,{
        body: JSON.stringify({
          userId: this.state.user.user.id,
          name: this.state.name,
          dueDate: this.state.dueDate,
          amount: this.state.amount
        }),
        method: 'PUT',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })  
      .then(this.handleCloseEditBillForm)
      .then(this.getBills)
      .catch(error => console.error({ Error: error }));
  }



  
  render() {

    const { user } = this.props.auth;
    console.log(this.state.bills)

    //Calculate home bills:
    const homeBillAmounts = []
    this.state.homeBills.map(function({amount}){
      return homeBillAmounts.push(amount)
    })
    const addHomeBills = array => array.reduce((a, b) => a + b, 0);
    var totalHomeBill = addHomeBills(homeBillAmounts);

    //Calculate transportation bills:
    const transportationBillAmounts = []
    this.state.transportationBills.map(function({amount}){
      return transportationBillAmounts.push(amount)
    })
    const addTransportationBills = array => array.reduce((a, b) => a + b, 0);
    var totalTransportationBill = addTransportationBills(transportationBillAmounts);

    //Calculate subscriptions bills:
    const subscriptionsBillAmounts = []
    this.state.subscriptionsBills.map(function({amount}){
      return subscriptionsBillAmounts.push(amount)
    })
    const addSubscriptionBills = array => array.reduce((a, b) => a + b, 0);
    var totalSubscriptionsBill = addSubscriptionBills(subscriptionsBillAmounts);

    //Calculate the total bills:
    let totalMonthlyBills = totalTransportationBill + totalHomeBill + totalSubscriptionsBill


    //Calculate needed earnings for comfort:
    let neededEarnings = Math.round(totalMonthlyBills*1.3) 


    //Setup the bar chart
    const doughnutChart = {
      labels: ['Home', 'Transportation', 'Subscriptions'],
      datasets: [
        {
          label: "Bill",
          backgroundColor: [
            "rgba(91,21,55,1)",
            "rgba(0,168,232,1)",
            "rgb(194, 168, 74)"
          ],
          borderColor: "rgba(27,121,106,1)",
          borderWidth:1,
          data: [totalHomeBill, totalTransportationBill, totalSubscriptionsBill]
        }
      ]
    }


    return (
      <div>
        <div className="category-container">
            <Link to="/dashboard" className="btn waves-effect waves-light hoverable" id="dashboard-back-button">Back To Dashboard</Link>
            <button onClick={this.onLogoutClick} className="btn waves-effect waves-light hoverable" id="accounts-log-out-button">
              Logout
            </button>
            <h5 className="category-introduction">Here are your monthly recurring bills, {user.name.split(" ")[0]}.</h5>
            <h6 className="category-introduction-small-text">Create and manage your monthly recurring bills to make sure you never miss a payment.</h6>
        </div>
        { this.state.addBill ?
          <div className="category-container">
            <div className="row">
              <form className="col s12" onSubmit={this.handleBillSubmit}>
                <div className="row">
                  <div className="input-field col s4">
                    <input type="text" id="name" name="name" className="validate" onChange={this.handleChange}/>
                    <label htmlFor="category">Name</label>
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
          <div className="bills-categories-main-container">
            <div className="bill-category-container" id="home">
              <div className="bill-category-name-container" id="home-bills">
              <div className="bill-category-icon-container">
                <i className="material-icons small bill-category-icon">home</i>
              </div>
              <h4 className="bill-category-name">Home</h4>
              </div>
              <div className="add-bill-button-container">
                <button style={{ marginRight: "1rem" }} className="btn btn-floating waves-effect waves-light hoverable" id="add-home-bill-button" onClick={() => this.handleOpenBillForm(1)}>
                  <i className="material-icons">add_circle</i>
                </button>
              </div>
              <div className="bill-cards-container">
                { this.state.homeBills.length === 0 ?
                  <div className="no-bill-warning">
                    <h6>You have not added any bills here yet, {user.name.split(" ")[0]}.</h6>
                    <h6>Add bills to begin analyzing your finances.</h6>
                  </div>
                :null }
                { this.state.homeBills.length > 0 ?
                  <div className="bill-list-container-home">
                  {this.state.homeBills.map( bill => {
                      return (
                      <div>
                      <div className="bill-list-card-home">
                          <div key={bill._id}>
                            <div className="bill-list-item-top-container">
                              <h5 className="bill-name">{bill.name}</h5>
                              <button onClick={() => this.deleteBill(bill._id)} className="btn btn-small btn-floating waves-effect waves-light hoverable" id="trash-bill-button">
                                <i className="material-icons">delete</i>
                              </button>
                              <button onClick={() => this.handleEditForm(bill)} className="btn btn-small btn-floating waves-effect waves-light hoverable" id="edit-bill-button">
                                <i className="material-icons">mode_edit</i>
                              </button>
                            </div>
                            <div className="bill-info-container">
                              <h5 className="bill-due">Due {bill.dueDate}</h5>
                              <h5 className="bill-amount">${parseFloat(bill.amount).toLocaleString('en')}</h5>
                            </div>
                          </div> 
                      </div>
                      <br />
                      </div>
                      )
                  })}
                    <hr id="hr-home"/>
                    <div className="total-home-bill-list-card">
                      <h5 className="total-bill-name">Total Home Bills:</h5>
                      <h5 className="total-bill-amount">${parseFloat(totalHomeBill).toLocaleString('en')}</h5>
                    </div>
                  </div>
                :null }
              </div>
            </div>
            <div className="bill-category-container" id="transportation">
              <div className="bill-category-name-container" id="transportation-bills">
                <div className="bill-category-icon-container">
                  <i className="material-icons small bill-category-icon">directions_car</i>
                </div>
                <h4 className="bill-category-name">Transportation</h4>
              </div>
              <div className="add-bill-button-container">
                <button style={{ marginRight: "1rem" }} className="btn btn-floating waves-effect waves-light hoverable" id="add-transportation-bill-button" onClick={() => this.handleOpenBillForm(2)}>
                  <i className="material-icons">add_circle</i>
                </button>
              </div>
              <div className="bill-cards-container">
                { this.state.transportationBills.length === 0 ?
                  <div className="no-bill-warning">
                    <h6>You have not added any bills here yet, {user.name.split(" ")[0]}.</h6>
                    <h6>Add bills to begin analyzing your finances.</h6>
                  </div>
                :null }
                { this.state.transportationBills.length > 0 ?
                  <div className="bill-list-container-home">
                  {this.state.transportationBills.map( bill => {
                      return (
                      <div>
                      <div className="bill-list-card-transportation">
                          <div key={bill._id}>
                            <div className="bill-list-item-top-container">
                              <h5 className="bill-name">{bill.name}</h5>
                              <button onClick={() => this.deleteBill(bill._id)} className="btn btn-small btn-floating waves-effect waves-light hoverable" id="trash-bill-button">
                                <i className="material-icons">delete</i>
                              </button>
                              <button onClick={() => this.handleEditForm(bill)} className="btn btn-small btn-floating waves-effect waves-light hoverable" id="edit-bill-button">
                                <i className="material-icons">mode_edit</i>
                              </button>
                            </div>
                            <div className="bill-info-container">
                              <h5 className="bill-due">Due {bill.dueDate}</h5>
                              <h5 className="bill-amount">${parseFloat(bill.amount).toLocaleString('en')}</h5>
                            </div>
                          </div> 
                      </div>
                      <br />
                      </div>
                      )
                  })}
                    <hr id="hr-transportation"/>
                    <div className="total-transportation-bill-list-card">
                      <h5 className="total-bill-name">Total Transportation Bills:</h5>
                      <h5 className="total-bill-amount">${parseFloat(totalTransportationBill).toLocaleString('en')}</h5>
                    </div>
                  </div>
                :null }
              </div>
            </div>
            <div className="bill-category-container" id="subscriptions">
              <div className="bill-category-name-container" id="subscription-bills">
                <div className="bill-category-icon-container">
                  <i className="material-icons small bill-category-icon">subscriptions</i>
                </div>
                <h4 className="bill-category-name">Subscriptions</h4>
              </div>
              <div className="add-bill-button-container">
                <button style={{ marginRight: "1rem" }} className="btn btn-floating waves-effect waves-light hoverable" id="add-subscription-bill-button" onClick={() => this.handleOpenBillForm(3)}>
                  <i className="material-icons">add_circle</i>
                </button>
              </div>
              <div className="bill-cards-container">
                { this.state.subscriptionsBills.length === 0 ?
                  <div className="no-bill-warning">
                    <h6>You have not added any bills here yet, {user.name.split(" ")[0]}.</h6>
                    <h6>Add bills to begin analyzing your finances.</h6>
                  </div>
                :null }
                { this.state.subscriptionsBills.length > 0 ?
                  <div className="bill-list-container-home">
                  {this.state.subscriptionsBills.map( bill => {
                      return (
                      <div>
                      <div className="bill-list-card-subscriptions">
                          <div key={bill._id}>
                            <div className="bill-list-item-top-container">
                              <h5 className="bill-name">{bill.name}</h5>
                              <button onClick={() => this.deleteBill(bill._id)} className="btn btn-small btn-floating waves-effect waves-light hoverable" id="trash-bill-button">
                                <i className="material-icons">delete</i>
                              </button>
                              <button onClick={() => this.handleEditForm(bill)} className="btn btn-small btn-floating waves-effect waves-light hoverable" id="edit-bill-button">
                                <i className="material-icons">mode_edit</i>
                              </button>
                            </div>
                            <div className="bill-info-container">
                              <h5 className="bill-due">Due {bill.dueDate}</h5>
                              <h5 className="bill-amount">${parseFloat(bill.amount).toLocaleString('en')}</h5>
                            </div>
                          </div> 
                      </div>
                      <br />
                      </div>
                      )
                  })}
                    <hr id="hr-subscriptions"/>
                    <div className="total-subscriptions-bill-list-card">
                      <h5 className="total-bill-name">Total Subscriptions Bills:</h5>
                      <h5 className="total-bill-amount">${parseFloat(totalSubscriptionsBill).toLocaleString('en')}</h5>
                    </div>
                  </div>
                :null }
              </div>
            </div>
            { this.state.bills.length > 0 ?
            <div className="bills-summary-container">
                <h5 className="bills-summary-intro">Your monthly recurring bills total is ${parseFloat(totalMonthlyBills).toLocaleString('en')}</h5>
                <h5 className="electrum-expert-recommendation">Based on Electrum's financial expert analysis, you must earn at least ${parseFloat(neededEarnings).toLocaleString('en')} per month in order to comfortably stay on top of your bills.</h5>
            </div>
            :null }
          </div>
          { this.state.bills.length > 0 ?
          <div className="bills-analysis-container">
            <h4 className="chart-title">Here's a Breakdown of Your Monthly Recurring Bills</h4>
            <Doughnut
              data={doughnutChart}
              options={{
                title:{
                  display:false,
                  text:'Monthly Recurring Bills Distribution',
                  fontSize:28
                },
                legend:{
                  display:'true',
                  position:'top',
                  labels: {
                    fontSize:18
                  }
                },
                tooltips:{
                  enabled:true,
                  backgroundColor:'#2f7a6a',
                  bodyFontSize:16
                }
              }}
            />
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