import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../../actions/authActions";

import { Doughnut} from 'react-chartjs-2';


class Investments extends Component {

  state = {
    user: this.props.auth,
    investments: [],
    investmentId: "",
    companyName: "",
    stockTag: "",
    numberOfShares: 0,
    addInvestment: false,
    editInvestment: false,
    stockPrices: []
  }

  componentDidMount() {
    this.getInvestments()
    this.getStockPrice()
  }

  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  
  getInvestments = () => {
    fetch('/api/investments/' + this.state.user.user.id)
    .then(res => res.json())
    .then(jsonedInvestments => this.setState({investments: jsonedInvestments}))
    .then(this.getStockTags)
    .catch( error => console.error(error))
  }

  handleInvestmentSubmit = (event) => {
      event.preventDefault()
      fetch('/api/investments/create',{
      body: JSON.stringify({
        userId: this.state.user.user.id,
        companyName: this.state.companyName,
        stockTag: this.state.stockTag,
        numberOfShares: this.state.numberOfShares
      }),
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      this.setState({
          companyName: '',
          stockTag: '',
          numberOfShares: 0

      })
    })
    .then(this.handleCloseInvestmentForm)
    .then(this.getInvestments)
    .catch(error => console.error({ Error: error }));
  }

  
  
  // Logout
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  //Form conditionals

  handleOpenInvestmentForm = () => {
    this.setState({addInvestment: true})
  }

  handleCloseInvestmentForm = () => {
    this.setState({addInvestment: false})
  }

  handleEditForm = (investment) => {
    this.setState({
      editInvestment: true,
      addInvestment: false,
      investmentId: investment._id,
      companyName: investment.companyName,
      stockTag: investment.stockTag,
      numberOfShares: investment.numberOfShares

    })
  }

  handleCloseEditForm = () => {
    this.setState({
      editBudget: false,
      investmentId: "",
      companyName: "",
      stockTag: "",
      numberOfShares: 0
    })
  }

  deleteInvestment = id => {
    fetch('/api/investments/' + id, {
      method: 'DELETE'
    }).then( res => {
      const investmentsArr = this.state.investments.filter( investment => {
        return investment.id !== id
      })
      this.setState({
        investments: investmentsArr
      })
    }).then(this.getInvestments())
  }


  handleEditInvestmentSubmit = () => {
    fetch('/api/investments/' + this.state.investmentId,{
        body: JSON.stringify({
          userId: this.state.user.user.id,
          companyName: this.state.companyName,
          stockTag: this.state.stockTag,
          numberOfShares: this.state.numberOfShares
        }),
        method: 'PUT',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })  
      .then(this.handleCloseEditInvestmentForm)
      .then(this.getInvestments)
      .catch(error => console.error({ Error: error }));
  }

  //STOCKS:

  //Get stock tags:
  getStockTags = () => {
    let stockTags = []
    {this.state.investments.map( stock => {
        return (
            stockTags.push(stock.stockTag),
            this.setState({stockTags})
        )
    })}
  }

  //Get a price (test):
  getStockPrice = () => {
    const key = require("./keys.js").stockKey;
    fetch("https://cloud.iexapis.com/stable/stock/MSFT/quote?token=" + key)
    .then(res => res.json())
    .then(jsonedStockPrice => this.setState({stockPrice: jsonedStockPrice}))
    .catch( error => console.error(error))
  }




  
  render() {
    const { user } = this.props.auth;
    console.log(this.state.user.user.id)

    console.log(this.state.stockPrice)

    console.log(this.state.investments)
    
    console.log(this.state.stockTags)

    // console.log(this.state.budgets)

    // const budgetAmounts = []
    // const budgetNames = []
    // this.state.budgets.map(function({amount}){
    //   return budgetAmounts.push(amount)
    // })
    // this.state.budgets.map(function({name}){
    //   return budgetNames.push(name)
    // })
    // console.log(budgetNames)
    // const addBudgets = array => array.reduce((a, b) => a + b, 0);
    // var totalBudget = addBudgets(budgetAmounts);
    // console.log(totalBudget)

    // console.log(Math.max(...budgetAmounts))

    return (
      <div>
        <div className="category-container">
            <Link to="/dashboard" className="btn waves-effect waves-light hoverable" id="dashboard-back-button">Back To Dashboard</Link>
            <button onClick={this.onLogoutClick} className="btn waves-effect waves-light hoverable" id="accounts-log-out-button">
              Logout
            </button>
            <h5 className="category-introduction">Here are your investments in the stock market, {user.name.split(" ")[0]}.</h5>
            <h6 className="category-introduction-small-text">Create and manage your stock investments to never lose track of your financial assets.</h6>
            <button onClick={this.handleOpenInvestmentForm} className="btn waves-effect waves-light hoverable" id="dashboard-back-button">
              Add An Investment
            </button>
        </div>
        { this.state.addInvestment ?
        <div className="category-container">
          <div className="row">
            <form className="col s12" onSubmit={this.handleInvestmentSubmit}>
              <div className="row">
                <div className="input-field col s4">
                  <input type="text" id="companyName" name="companyName" className="validate" onChange={this.handleChange}/>
                  <label htmlFor="category">Company Name</label>
                </div>
                <div className="input-field col s2">
                  <input type="text" id="stockTag" name="stockTag" className="validate" onChange={this.handleChange}/>
                  <label htmlFor="category">Stock Exchange Tag</label>
                </div>  
                <div className="input-field col s2">
                  <input type="text" id="numberOfShares" name="numberOfShares" className="validate" onChange={this.handleChange} />
                  <label htmlFor="amount">Number of Shares</label>
                </div>
                <input type="submit" className="btn" id="budget-form-button" value="Enter"/>
                <button onClick={this.handleCloseInvestmentForm} className="btn" id="budget-form-cancel-button">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
        :null }
        { this.state.editInvestment ?
        <div className="category-container">
          <div className="row">
            <form className="col s12" onSubmit={this.handleEditInvestmentSubmit}>
              <div className="row">
                <div className="input-field col s4">
                  <input type="text" id="companyName" name="companyName" className="validate" onChange={this.handleChange} value={this.state.companyName}/>
                </div> 
                <div className="input-field col s2">
                  <input type="text" id="stockTag" name="stockTag" className="validate" onChange={this.handleChange} value={this.state.stockTag}/>
                </div> 
                <div className="input-field col s2">
                  <input type="text" id="numberOfShares" name="numberOfShares" className="validate" onChange={this.handleChange} value={this.state.numberOfShares}/>
                </div>
                <input type="submit" className="btn" id="budget-form-button" value="Submit"/>
                <button onClick={this.handleCloseEditInvestmentForm} className="btn" id="budget-form-cancel-button">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
        :null }
        <div className="category-container" id="stocks-main-container">
        { this.state.investments.length === 0 ?
        <div className="no-budget-warning">
          <h5>You have not added any investments yet, {user.name.split(" ")[0]}.</h5>
          <h6>Add your stock investments to begin tracking your assets.</h6>
        </div>
        :null }
        { this.state.investments.length > 0 ?
        <div>
        <div className="stocks-list-container">
        {this.state.investments.map( investment => {
            return (
            <div>
            <div className="stock-list-card">
                <div key={investment._id}>
                    <div>
                        <div className="stock-card-header">
                            <h5 className="stock-name">{investment.companyName}</h5>
                            <div className="stocks-button-container">
                                <button onClick={() => this.handleEditForm(investment)} className="btn btn btn-floating waves-effect waves-light hoverable" id="edit-budget-button">
                                    <i className="material-icons">mode_edit</i>
                                </button>
                                <button onClick={() => this.deleteInvestment(investment._id)} className="btn btn btn-floating waves-effect waves-light hoverable" id="trash-budget-button">
                                    <i className="material-icons">delete</i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="stock-info-main-container">
                        <div className="stock-info-div">
                            <h5 className="stock-info-title">Stock Exchange Tag:</h5>
                            <h5 className="stock-info-value">{investment.stockTag}</h5>
                        </div>
                        <div className="stock-info-div">
                            <h5 className="stock-info-title">Number of Owned Shares:</h5>
                            <h5 className="stock-info-value">{investment.numberOfShares}</h5>
                        </div>
                        <div className="stock-info-div">
                            <h5 className="stock-info-title">*Current Price:</h5>
                            <h5 className="stock-info-value">Number</h5>
                        </div>
                        <hr id="stocks-hr" />
                        <div className="stock-info-div">
                            <h5 className="stock-info-title">Total Owned Assets:</h5>
                            <h5 className="stock-info-value">Number</h5>
                        </div>
                    </div>
                </div> 
            </div>
            <br />
            </div>
            )
        })}
        </div>
            <h5 className="stock-price-warning">*Stock prices are updated every fifteen minutes.</h5>
        </div>
        :null }
        </div>
      </div>
    );
  }
}

Investments.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(Investments);