import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { getAccounts, addAccount, getTransactions } from "../../actions/accountActions";

import { Doughnut} from 'react-chartjs-2';

class Banking extends Component {

  componentDidMount() {
    const { accounts } = this.props;
    this.props.getTransactions(accounts);
  }

  // Logout
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };


  // Add account
  handleOnSuccess = (token, metadata) => {
    const plaidData = {
      public_token: token,
      metadata: metadata
    };
    this.props.addAccount(plaidData);
  };

  render() {

    const { user} = this.props;
    const { transactions} = this.props.plaid;
    console.log(transactions)

    let transactionsData = []
    transactions.forEach(function(account){
        account.transactions.forEach(function(transaction){
            transactionsData.push({
                account: account.accountName,
                date: transaction.date,
                category: transaction.category[0],
                name: transaction.name,
                amount: "$" + transaction.amount
            });
        });
    });
    // console.log(transactionsData)
    
    //Find Specific Category Transactions
    let foodTransactions = []
    let shopsTransactions = []
    let paymentTransactions = []
    let travelTransactions = []
    let transferTransactions = []
    let recreationTransactions = []
    {transactionsData.map( transaction => {
      if (transaction.category === "Food and Drink") {
        return (
          foodTransactions.push(transaction)
        )
      } else if (transaction.category === "Shops") {
        return (
          shopsTransactions.push(transaction)
        )
      } else if (transaction.category === "Payment") {
        return (
          paymentTransactions.push(transaction)
        )
      } else if (transaction.category === "Travel") {
        return (
          travelTransactions.push(transaction)
        )
      } else if (transaction.category === "Transfer") {
        return (
          transferTransactions.push(transaction)
        )
      } else if (transaction.category === "Recreation") {
        return (
          recreationTransactions.push(transaction)
        )
      }
    })}
    console.log(foodTransactions)
    console.log(shopsTransactions)
    console.log(paymentTransactions)
    console.log(travelTransactions)
    console.log(transferTransactions)
    console.log(recreationTransactions)

    // Calculate Total Food Expenses:
    const foodExpenseAmounts = []
    foodTransactions.map(function({amount}){
      let numbify = amount.replace(/\$/g,'');
      let expenseNumber = numbify*1
      return foodExpenseAmounts.push(expenseNumber)
    })
    const addFoodExpenses = array => array.reduce((a, b) => a + b, 0);
    var totalFoodExpense = (addFoodExpenses(foodExpenseAmounts)).toFixed(2);
    console.log(foodExpenseAmounts)

    // Calculate Total Shops Expenses:
    const shopExpenseAmounts = []
    shopsTransactions.map(function({amount}){
      let numbify = amount.replace(/\$/g,'');
      let expenseNumber = numbify*1
      return shopExpenseAmounts.push(expenseNumber)
    })
    const addShopExpenses = array => array.reduce((a, b) => a + b, 0);
    var totalShopExpense = (addShopExpenses(shopExpenseAmounts)).toFixed(2);
    console.log(shopExpenseAmounts)

    // Calculate Total Payment Expenses:
    const paymentExpenseAmounts = []
    paymentTransactions.map(function({amount}){
      let numbify = amount.replace(/\$/g,'');
      let expenseNumber = numbify*1
      return paymentExpenseAmounts.push(expenseNumber)
    })
    const addPaymentExpenses = array => array.reduce((a, b) => a + b, 0);
    var totalPaymentExpense = (addPaymentExpenses(paymentExpenseAmounts)).toFixed(2);
    console.log(paymentExpenseAmounts)

    // Calculate Total Travel Expenses:
    const travelExpenseAmounts = []
    travelTransactions.map(function({amount}){
      let numbify = amount.replace(/\$/g,'');
      let expenseNumber = numbify*1
      return travelExpenseAmounts.push(expenseNumber)
    })
    const addTravelExpenses = array => array.reduce((a, b) => a + b, 0);
    var totalTravelExpense = (addTravelExpenses(travelExpenseAmounts)).toFixed(2);
    console.log(travelExpenseAmounts)

    // Calculate Total Transfer Expenses:
    const transferExpenseAmounts = []
    transferTransactions.map(function({amount}){
      let numbify = amount.replace(/\$/g,'');
      let expenseNumber = numbify*1
      return transferExpenseAmounts.push(expenseNumber)
    })
    const addTransferExpenses = array => array.reduce((a, b) => a + b, 0);
    var totalTransferExpense = (addTransferExpenses(transferExpenseAmounts)).toFixed(2);
    console.log(transferExpenseAmounts)

    // Calculate Total Recreation Expenses:
    const recreationExpenseAmounts = []
    recreationTransactions.map(function({amount}){
      let numbify = amount.replace(/\$/g,'');
      let expenseNumber = numbify*1
      return recreationExpenseAmounts.push(expenseNumber)
    })
    const addRecreationExpenses = array => array.reduce((a, b) => a + b, 0);
    var totalRecreationExpense = (addRecreationExpenses(recreationExpenseAmounts)).toFixed(2);
    console.log(recreationExpenseAmounts)

    //Setup the bar chart
    const doughnutChart = {
      labels: ['Food and Drink', 'Shopping', 'Payments', 'Travel', 'Transfers', 'Recreation'],
      datasets: [
        {
          label: "Bill",
          backgroundColor: [
            "rgba(91,21,55,1)",
            "rgba(0,168,232,1)",
            "rgb(194, 168, 74)",
            "rgba(50,172,109,1)",
            "rgba(242,116,5,1)",
            "rgba(116,106,255,1)"
          ],
          borderColor: "rgba(27,121,106,1)",
          borderWidth:1,
          data: [totalFoodExpense, totalShopExpense, totalPaymentExpense, totalTravelExpense, totalTransferExpense, totalRecreationExpense]
        }
      ]
    }

    //calculate total transactions:
    let totalBankTransactions = ((totalFoodExpense*1) + (totalShopExpense*1) + (totalPaymentExpense*1) + (totalTravelExpense*1) + (totalTransferExpense*1) + (totalRecreationExpense*1)).toFixed(2)

    return (
        <div>
          <div className="expense-categories-parent-container">
          { foodTransactions.length > 0 ?
          <div>
            <h5 className="expenses-chart-introduction">Here is a breakdown of your banking transactions from the last 30 days, {user.name.split(" ")[0]}.</h5>
            <div className="expenses-chart-container">
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
                  position:'right',
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
            <div className="banking-analysis-container">
              <h5 className="banking-analysis-summary">
                In the past 30 days, your total banking transactions total ${parseFloat(totalBankTransactions).toLocaleString('en')}
              </h5>
            </div>
            </div>
            :null }
            <h5 className="expenses-introduction">Here are all of your financial transactions from your linked accounts in the last 30 days, {user.name.split(" ")[0]}.</h5>
            <div className="expense-category-container" id="food">
              <div className="bill-category-name-container" id="food-title">
              <div className="bill-category-icon-container">
                <i className="material-icons small bill-category-icon">local_dining</i>
              </div>
              <h4 className="bill-category-name">Food and Drink</h4>
              </div>
              <div className="bill-cards-container">
                { foodTransactions.length === 0 ?
                  <div className="no-bill-warning">
                    <h6>You have not added any bills here yet, {user.name.split(" ")[0]}.</h6>
                    <h6>Add bills to begin analyzing your finances.</h6>
                  </div>
                :null }
                { foodTransactions.length > 0 ?
                  <div className="expense-list-container-home">
                  {foodTransactions.map( transaction => {
                      return (
                      <div>
                      <div className="bill-list-card-home" id="food-expense-item-card">
                          <div key={transaction._id}>
                            <div className="expense-list-item-left-container">
                              <h5 className="expense-name">{transaction.name.substring(0,17)}</h5>
                              <h5 className="expense-date">{transaction.date}</h5>
                            </div>
                            <div className="expense-list-item-right-container">
                              <h5 className="expense-amount">{transaction.amount}</h5>
                            </div>
                          </div> 
                      </div>
                      <br />
                      </div>
                      )
                  })}
                    <hr id="hr-food"/>
                    <div className="total-home-bill-list-card">
                      <h5 className="total-expense-name">Total Food:</h5>
                      <h5 className="total-expense-amount">${parseFloat(totalFoodExpense).toLocaleString('en')}</h5>
                    </div>
                  </div>
                :null }
              </div>
            </div>
            <div className="expense-category-container" id="shopping">
              <div className="bill-category-name-container" id="shopping-title">
              <div className="bill-category-icon-container">
                <i className="material-icons small bill-category-icon">shopping_basket</i>
              </div>
              <h4 className="bill-category-name">Shopping</h4>
              </div>
              <div className="bill-cards-container">
                { shopsTransactions.length === 0 ?
                  <div className="no-bill-warning">
                    <h6>You have not added any bills here yet, {user.name.split(" ")[0]}.</h6>
                    <h6>Add bills to begin analyzing your finances.</h6>
                  </div>
                :null }
                { shopsTransactions.length > 0 ?
                  <div className="expense-list-container-home">
                  {shopsTransactions.map( transaction => {
                      return (
                      <div>
                      <div className="bill-list-card-home" id="shopping-expense-item-card">
                          <div key={transaction._id}>
                            <div className="expense-list-item-left-container">
                              <h5 className="expense-name">{transaction.name.substring(0,17)}</h5>
                              <h5 className="expense-date">{transaction.date}</h5>
                            </div>
                            <div className="expense-list-item-right-container">
                              <h5 className="expense-amount">{transaction.amount}</h5>
                            </div>
                          </div> 
                      </div>
                      <br />
                      </div>
                      )
                  })}
                    <hr id="hr-shopping"/>
                    <div className="total-home-bill-list-card" id="shopping-total-card">
                      <h5 className="total-expense-name">Total Shopping:</h5>
                      <h5 className="total-expense-amount">${parseFloat(totalShopExpense).toLocaleString('en')}</h5>
                    </div>
                  </div>
                :null }
              </div>
            </div>
            <div className="expense-category-container" id="payments">
              <div className="bill-category-name-container" id="payments-title">
              <div className="bill-category-icon-container">
                <i className="material-icons small bill-category-icon">payment</i>
              </div>
              <h4 className="bill-category-name">Payments</h4>
              </div>
              <div className="bill-cards-container">
                { paymentTransactions.length === 0 ?
                  <div className="no-bill-warning">
                    <h6>You have not added any bills here yet, {user.name.split(" ")[0]}.</h6>
                    <h6>Add bills to begin analyzing your finances.</h6>
                  </div>
                :null }
                { paymentTransactions.length > 0 ?
                  <div className="expense-list-container-home">
                  {paymentTransactions.map( transaction => {
                      return (
                      <div>
                      <div className="bill-list-card-home" id="payments-expense-item-card">
                          <div key={transaction._id}>
                            <div className="expense-list-item-left-container">
                              <h5 className="expense-name">{transaction.name.substring(0,17)}</h5>
                              <h5 className="expense-date">{transaction.date}</h5>
                            </div>
                            <div className="expense-list-item-right-container">
                              <h5 className="expense-amount">{transaction.amount}</h5>
                            </div>
                          </div> 
                      </div>
                      <br />
                      </div>
                      )
                  })}
                    <hr id="hr-payments"/>
                    <div className="total-home-bill-list-card" id="payments-total-card">
                      <h5 className="total-expense-name">Total Payments:</h5>
                      <h5 className="total-expense-amount">${parseFloat(totalPaymentExpense).toLocaleString('en')}</h5>
                    </div>
                  </div>
                :null }
              </div>
            </div>
            <div className="expense-category-container" id="travel">
              <div className="bill-category-name-container" id="travel-title">
              <div className="bill-category-icon-container">
                <i className="material-icons small bill-category-icon">airport_shuttle</i>
              </div>
              <h4 className="bill-category-name">Travel</h4>
              </div>
              <div className="bill-cards-container">
                { travelTransactions.length === 0 ?
                  <div className="no-bill-warning">
                    <h6>You have not added any bills here yet, {user.name.split(" ")[0]}.</h6>
                    <h6>Add bills to begin analyzing your finances.</h6>
                  </div>
                :null }
                { travelTransactions.length > 0 ?
                  <div className="expense-list-container-home">
                  {travelTransactions.map( transaction => {
                      return (
                      <div>
                      <div className="bill-list-card-home" id="travel-expense-item-card">
                          <div key={transaction._id}>
                            <div className="expense-list-item-left-container">
                              <h5 className="expense-name">{transaction.name.substring(0,17)}</h5>
                              <h5 className="expense-date">{transaction.date}</h5>
                            </div>
                            <div className="expense-list-item-right-container">
                              <h5 className="expense-amount">{transaction.amount}</h5>
                            </div>
                          </div> 
                      </div>
                      <br />
                      </div>
                      )
                  })}
                    <hr id="hr-travel"/>
                    <div className="total-home-bill-list-card" id="travel-total-card">
                      <h5 className="total-expense-name">Travelling Total:</h5>
                      <h5 className="total-expense-amount">${parseFloat(totalTravelExpense).toLocaleString('en')}</h5>
                    </div>
                  </div>
                :null }
              </div>
            </div>
            <div className="expense-category-container" id="transfers">
              <div className="bill-category-name-container" id="transfer-title">
              <div className="bill-category-icon-container">
                <i className="material-icons small bill-category-icon">local_atm</i>
              </div>
              <h4 className="bill-category-name">Transfers</h4>
              </div>
              <div className="bill-cards-container">
                { transferTransactions.length === 0 ?
                  <div className="no-bill-warning">
                    <h6>You have not added any bills here yet, {user.name.split(" ")[0]}.</h6>
                    <h6>Add bills to begin analyzing your finances.</h6>
                  </div>
                :null }
                { transferTransactions.length > 0 ?
                  <div className="expense-list-container-home">
                  {transferTransactions.map( transaction => {
                      return (
                      <div>
                      <div className="bill-list-card-home" id="transfer-expense-item-card">
                          <div key={transaction._id}>
                            <div className="expense-list-item-left-container">
                              <h5 className="expense-name">{transaction.name.substring(0,17)}</h5>
                              <h5 className="expense-date">{transaction.date}</h5>
                            </div>
                            <div className="expense-list-item-right-container">
                              <h5 className="expense-amount">{transaction.amount}</h5>
                            </div>
                          </div> 
                      </div>
                      <br />
                      </div>
                      )
                  })}
                    <hr id="hr-transfers"/>
                    <div className="total-home-bill-list-card" id="transfer-total-card">
                      <h5 className="total-expense-name">Total Transfers:</h5>
                      <h5 className="total-expense-amount">${parseFloat(totalTransferExpense).toLocaleString('en')}</h5>
                    </div>
                  </div>
                :null }
              </div>
            </div>
            <div className="expense-category-container" id="recreation">
              <div className="bill-category-name-container" id="recreation-title">
              <div className="bill-category-icon-container">
                <i className="material-icons small bill-category-icon">local_play</i>
              </div>
              <h4 className="bill-category-name">Recreation</h4>
              </div>
              <div className="bill-cards-container">
                { recreationTransactions.length === 0 ?
                  <div className="no-bill-warning">
                    <h6>You have not added any bills here yet, {user.name.split(" ")[0]}.</h6>
                    <h6>Add bills to begin analyzing your finances.</h6>
                  </div>
                :null }
                { recreationTransactions.length > 0 ?
                  <div className="expense-list-container-home">
                  {recreationTransactions.map( transaction => {
                      return (
                      <div>
                      <div className="bill-list-card-home" id="recreation-expense-item-card">
                          <div key={transaction._id}>
                            <div className="expense-list-item-left-container">
                              <h5 className="expense-name">{transaction.name.substring(0,17)}</h5>
                              <h5 className="expense-date">{transaction.date}</h5>
                            </div>
                            <div className="expense-list-item-right-container">
                              <h5 className="expense-amount">{transaction.amount}</h5>
                            </div>
                          </div> 
                      </div>
                      <br />
                      </div>
                      )
                  })}
                    <hr id="hr-recreation"/>
                    <div className="total-home-bill-list-card" id="recreation-total-card">
                      <h5 className="total-expense-name">Total Recreation:</h5>
                      <h5 className="total-expense-amount">${parseFloat(totalRecreationExpense).toLocaleString('en')}</h5>
                    </div>
                  </div>
                :null }
              </div>
            </div>
          </div>
        </div>
    )
  }
}

Banking.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  getAccounts: PropTypes.func.isRequired,
  getTransactions: PropTypes.func.isRequired,
  addAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  plaid: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  plaid: state.plaid
});

export default connect(
  mapStateToProps,
  { logoutUser, getAccounts, addAccount, getTransactions }
)(Banking);