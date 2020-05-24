import React, { Component } from "react";
import PlaidLinkButton from "react-plaid-link-button";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { getAccounts, addAccount, getTransactions } from "../../actions/accountActions";


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

    const { user, accounts } = this.props;
    const { transactions, transactionsLoading } = this.props.plaid;
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
    var totalFoodExpense = addFoodExpenses(foodExpenseAmounts);
    console.log(foodExpenseAmounts)

    // Calculate Total Shops Expenses:
    const shopExpenseAmounts = []
    shopsTransactions.map(function({amount}){
      let numbify = amount.replace(/\$/g,'');
      let expenseNumber = numbify*1
      return shopExpenseAmounts.push(expenseNumber)
    })
    const addShopExpenses = array => array.reduce((a, b) => a + b, 0);
    var totalShopExpense = addShopExpenses(shopExpenseAmounts);
    console.log(shopExpenseAmounts)

    // Calculate Total Payment Expenses:
    const paymentExpenseAmounts = []
    paymentTransactions.map(function({amount}){
      let numbify = amount.replace(/\$/g,'');
      let expenseNumber = numbify*1
      return paymentExpenseAmounts.push(expenseNumber)
    })
    const addPaymentExpenses = array => array.reduce((a, b) => a + b, 0);
    var totalPaymentExpense = addPaymentExpenses(paymentExpenseAmounts);
    console.log(paymentExpenseAmounts)

    // Calculate Total Travel Expenses:
    const travelExpenseAmounts = []
    travelTransactions.map(function({amount}){
      let numbify = amount.replace(/\$/g,'');
      let expenseNumber = numbify*1
      return travelExpenseAmounts.push(expenseNumber)
    })
    const addTravelExpenses = array => array.reduce((a, b) => a + b, 0);
    var totalTravelExpense = addTravelExpenses(travelExpenseAmounts);
    console.log(travelExpenseAmounts)

    // Calculate Total Transfer Expenses:
    const transferExpenseAmounts = []
    transferTransactions.map(function({amount}){
      let numbify = amount.replace(/\$/g,'');
      let expenseNumber = numbify*1
      return transferExpenseAmounts.push(expenseNumber)
    })
    const addTransferExpenses = array => array.reduce((a, b) => a + b, 0);
    var totalTransferExpense = addTransferExpenses(transferExpenseAmounts);
    console.log(transferExpenseAmounts)

    // Calculate Total Recreation Expenses:
    const recreationExpenseAmounts = []
    recreationTransactions.map(function({amount}){
      let numbify = amount.replace(/\$/g,'');
      let expenseNumber = numbify*1
      return recreationExpenseAmounts.push(expenseNumber)
    })
    const addRecreationExpenses = array => array.reduce((a, b) => a + b, 0);
    var totalRecreationExpense = addRecreationExpenses(recreationExpenseAmounts);
    console.log(recreationExpenseAmounts)

    return (
        <div>
          <div className="expense-categories-parent-container">
            <div className="bill-category-container" id="home">
              <div className="bill-category-name-container" id="home-bills">
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
                      <div className="bill-list-card-home">
                          <div key={transaction._id}>
                            <div className="expense-list-item-left-container">
                              <h5 className="expense-name">{transaction.name}</h5>
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
                    <hr id="hr-home"/>
                    <div className="total-home-bill-list-card">
                      <h5 className="total-bill-name">Total Food Expenses:</h5>
                      <h5 className="total-bill-amount">${totalFoodExpense}</h5>
                    </div>
                  </div>
                :null }
              </div>
            </div>
            <div className="bill-category-container" id="home">
              <div className="bill-category-name-container" id="home-bills">
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
                      <div className="bill-list-card-home">
                          <div key={transaction._id}>
                            <div className="expense-list-item-left-container">
                              <h5 className="expense-name">{transaction.name}</h5>
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
                    <hr id="hr-home"/>
                    <div className="total-home-bill-list-card">
                      <h5 className="total-bill-name">Total Shopping Expenses:</h5>
                      <h5 className="total-bill-amount">${totalShopExpense}</h5>
                    </div>
                  </div>
                :null }
              </div>
            </div>
            <div className="bill-category-container" id="home">
              <div className="bill-category-name-container" id="home-bills">
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
                      <div className="bill-list-card-home">
                          <div key={transaction._id}>
                            <div className="expense-list-item-left-container">
                              <h5 className="expense-name">{transaction.name}</h5>
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
                    <hr id="hr-home"/>
                    <div className="total-home-bill-list-card">
                      <h5 className="total-bill-name">Total Payment Expenses:</h5>
                      <h5 className="total-bill-amount">${totalPaymentExpense}</h5>
                    </div>
                  </div>
                :null }
              </div>
            </div>
            <div className="bill-category-container" id="home">
              <div className="bill-category-name-container" id="home-bills">
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
                      <div className="bill-list-card-home">
                          <div key={transaction._id}>
                            <div className="expense-list-item-left-container">
                              <h5 className="expense-name">{transaction.name}</h5>
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
                    <hr id="hr-home"/>
                    <div className="total-home-bill-list-card">
                      <h5 className="total-bill-name">Total Travel Expenses:</h5>
                      <h5 className="total-bill-amount">${totalTravelExpense}</h5>
                    </div>
                  </div>
                :null }
              </div>
            </div>
            <div className="bill-category-container" id="home">
              <div className="bill-category-name-container" id="home-bills">
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
                      <div className="bill-list-card-home">
                          <div key={transaction._id}>
                            <div className="expense-list-item-left-container">
                              <h5 className="expense-name">{transaction.name}</h5>
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
                    <hr id="hr-home"/>
                    <div className="total-home-bill-list-card">
                      <h5 className="total-bill-name">Total Transfer Expenses:</h5>
                      <h5 className="total-bill-amount">${totalTransferExpense}</h5>
                    </div>
                  </div>
                :null }
              </div>
            </div>
            <div className="bill-category-container" id="home">
              <div className="bill-category-name-container" id="home-bills">
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
                      <div className="bill-list-card-home">
                          <div key={transaction._id}>
                            <div className="expense-list-item-left-container">
                              <h5 className="expense-name">{transaction.name}</h5>
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
                    <hr id="hr-home"/>
                    <div className="total-home-bill-list-card">
                      <h5 className="total-bill-name">Total Food Expenses:</h5>
                      <h5 className="total-bill-amount">${totalRecreationExpense}</h5>
                    </div>
                  </div>
                :null }
              </div>
            </div>
          </div>
            <h1>Banking Analysis</h1>
            <h5>organize by transaction category</h5>
            <h5>make a card that totals the amount in that category of spending</h5>
            <h5>Allow user to make a category invisible</h5>
            <h5>User can see the amount of total spending in all categories</h5>
            <h5>User can see charts of th amount of spending analyzed</h5>
            <h5></h5>
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