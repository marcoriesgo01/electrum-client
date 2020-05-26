import React, { Component } from "react";
import PropTypes from "prop-types";
import PlaidLinkButton from "react-plaid-link-button";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getTransactions, addAccount, deleteAccount} from "../../actions/accountActions";
import { logoutUser } from "../../actions/authActions";
import MaterialTable from "material-table";


import budgetspic from "../../img/budgets.png";
import expensespic from "../../img/expenses.png";
import billspic from "../../img/bills.png";
import investmentspic from "../../img/investments.png";


class Accounts extends Component {
  
  componentDidMount() {
    const { accounts } = this.props;
    this.props.getTransactions(accounts);
    
  }

  // Add account
  handleOnSuccess = (token, metadata) => {
    const { accounts } = this.props;
    const plaidData = {
      public_token: token,
      metadata: metadata,
      accounts: accounts
    };
    this.props.addAccount(plaidData);
  };

  // Delete account
  onDeleteClick = id => {
    const { accounts } = this.props;
    const accountData = {
      id: id,
      accounts: accounts
    };
    this.props.deleteAccount(accountData);
  };


  // Logout
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };


  render() {
    const { user, accounts } = this.props;
    const { transactions, transactionsLoading } = this.props.plaid;
    
    let accountItems = accounts.map(account => (
      <li key={account._id} style={{ marginTop: "1rem" }}>
        <button style={{ marginRight: "1rem" }} onClick={this.onDeleteClick.bind(this, account._id)} className="btn btn-small btn-floating waves-effect waves-light hoverable" id="trash-button">
          <i className="material-icons">delete</i>
        </button>
        <b>{account.institutionName}</b>
      </li>
    ));

    // Data table
    const transactionsColumns = [
      { title: "Account", field: "account" },
      { title: "Date", field: "date", type: "date", defaultSort: "desc" },
      { title: "Name", field: "name" },
      { title: "Amount", field: "amount" },
      { title: "Category", field: "category" }
    ];

    let transactionsData = [];
    transactions.forEach(function(account) {
      account.transactions.forEach(function(transaction) {
        transactionsData.push({
          account: account.accountName,
          date: transaction.date,
          category: transaction.category[0],
          name: transaction.name,
          amount: "$" + transaction.amount
        });
      });
    });
return (
      <div className="row">
        <div className="col s12" id="dashboard-main-accounts-container">
          <button onClick={this.onLogoutClick} className="btn waves-effect waves-light hoverable" id="accounts-log-out-button">
              Logout
          </button>
          <h4 className="hey-there-user-dashboard"><b>Hey there, {user.name.split(" ")[0]}</b></h4>
          <div className="categories-container">
            <Link to="/expenses">
                <div className="card">
                    <div className="card-image">
                        <img src={expensespic} alt="category"/>
                    </div>
                    <div className="card-content">
                        <h5>Expenses</h5>
                    </div>
                </div>
            </Link>
            <Link to="/budgets">
                <div className="card">
                    <div className="card-image">
                        <img src={budgetspic} alt="category"/>
                    </div>
                    <div className="card-content">
                        <h5>Budgets</h5>
                    </div>
                </div>
            </Link>
            <Link to="/bills">
                <div className="card">
                    <div className="card-image">
                        <img src={billspic} alt="category"/>
                    </div>
                    <div className="card-content">
                        <h5>Bills</h5>
                    </div>
                </div>
            </Link>
            <Link to="/investments">
                <div className="card">
                    <div className="card-image">
                        <img src={investmentspic} alt="category"/>
                    </div>
                    <div className="card-content">
                        <h5>Investments</h5>
                    </div>
                </div>
            </Link>
          </div>
          <hr />
          <h5 id="linked-accounts-header"><b>Linked Bank Accounts</b></h5>
          <p className="grey-text text-darken-1">Add or remove your bank accounts below</p>
          <ul>{accountItems}</ul>
          <PlaidLinkButton
            buttonProps={{ className: "btn btn-large waves-effect waves-light hoverable blue accent-3 main-btn" }}
            plaidLinkProps={{ clientName: "Electrum", key: "540d604a54c1be6953e144f794eb33", env: "sandbox", product: ["transactions"], onSuccess: this.handleOnSuccess }}
            onScriptLoad={() => this.setState({ loaded: true })}>
            Add Account
          </PlaidLinkButton>
          <hr style={{ marginTop: "2rem" }} />
          <h5>
            <b>Transactions</b>
          </h5>
          {transactionsLoading ? (
            <p className="grey-text text-darken-1">Fetching transactions...</p>
          ) : (
            <>
              <p className="grey-text text-darken-1">
                You have <b>{transactionsData.length}</b> transactions from your
                <b> {accounts.length}</b> linked
                {accounts.length > 1 ? (
                  <span> accounts </span>
                ) : (
                  <span> account </span>
                )}
                from the past 30 days
              </p>
              <MaterialTable
                columns={transactionsColumns}
                data={transactionsData}
                title="Search Transactions"
              />
            </>
          )}
        </div>
      </div>
    );
  }
}
Accounts.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  getTransactions: PropTypes.func.isRequired,
  addAccount: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  accounts: PropTypes.array.isRequired,
  plaid: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  plaid: state.plaid
});
export default connect(
  mapStateToProps,
  { logoutUser, getTransactions, addAccount, deleteAccount }
)(Accounts);